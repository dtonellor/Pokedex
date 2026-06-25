import { useState, useEffect, useCallback, useRef } from 'react';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  shinyImage: string;
  types: string[];
  height: number;
  weight: number;
  stats: Array<{
    name: string;
    value: number;
  }>;
  abilities: string[];
  evolutions: Array<{ id: number; name: string; image: string }>;
}

interface PokemonName {
  name: string;
  url: string;
}

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

async function fetchPokemonDetails(nameOrUrl: string): Promise<Pokemon> {
  const url = nameOrUrl.includes('pokeapi.co')
    ? nameOrUrl
    : `${POKEAPI_BASE}/pokemon/${nameOrUrl.toLowerCase()}`;

  const res = await fetch(url);
  const details = await res.json();

  const image =
    details.sprites.other['official-artwork'].front_default ||
    details.sprites.front_default;
  const shinyImage =
    details.sprites.other['official-artwork'].front_shiny ||
    details.sprites.front_shiny;

  return {
    id: details.id,
    name: details.name.charAt(0).toUpperCase() + details.name.slice(1),
    image,
    shinyImage,
    types: details.types.map((t: any) => t.type.name),
    height: details.height / 10,
    weight: details.weight / 10,
    stats: details.stats.map((s: any) => ({
      name: s.stat.name.toUpperCase().replace('-', ' '),
      value: s.base_stat,
    })),
    abilities: details.abilities.map((a: any) => a.ability.name),
    evolutions: [],
  };
}

async function fetchEvolutionChain(speciesUrl: string): Promise<Array<{ id: number; name: string; image: string }>> {
  try {
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();

    const chainRes = await fetch(speciesData.evolution_chain.url);
    const chainData = await chainRes.json();

    const evolutions: Array<{ id: number; name: string; image: string }> = [];

    const traverseChain = (chain: any) => {
      const name = chain.species.name;
      const urlParts = chain.species.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 2]);
      evolutions.push({
        id,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      });

      if (chain.evolves_to && chain.evolves_to.length > 0) {
        for (const evo of chain.evolves_to) {
          traverseChain(evo);
        }
      }
    };

    traverseChain(chainData.chain);
    return evolutions;
  } catch {
    return [];
  }
}

export function usePokemonAPI() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [allPokemonNames, setAllPokemonNames] = useState<PokemonName[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [selectedPokemonIndex, setSelectedPokemonIndex] = useState(-1);
  const initialLoadRef = useRef(false);
  const detailCacheRef = useRef<Map<string, Pokemon>>(new Map());

  // Fetch ALL Pokemon names on mount
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const fetchAllNames = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=1500&offset=0`);
        const data = await response.json();
        setAllPokemonNames(data.results);

        // Load first 50 with full details for immediate display
        const first50 = data.results.slice(0, 50);
        const details = await Promise.all(
          first50.map((p: PokemonName) => fetchPokemonDetails(p.url))
        );
        setPokemonList(details);

        // Auto-select first pokemon
        if (details.length > 0) {
          setSelectedPokemon(details[0]);
          setSelectedPokemonIndex(0);
        }
      } catch (error) {
        console.error('Erro ao buscar Pokémons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNames();
  }, []);

  // Load more pokemon (lazy load next batch)
  const loadMore = useCallback(async (startIndex: number, count: number) => {
    if (startIndex >= allPokemonNames.length) return;
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const batch = allPokemonNames.slice(startIndex, startIndex + count);
      const details = await Promise.all(
        batch.map((p: PokemonName) => {
          if (detailCacheRef.current.has(p.name)) {
            return Promise.resolve(detailCacheRef.current.get(p.name)!);
          }
          return fetchPokemonDetails(p.url);
        })
      );

      // Cache results
      details.forEach((p) => detailCacheRef.current.set(p.name.toLowerCase(), p));

      setPokemonList((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPokemon = details.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPokemon];
      });
    } catch (error) {
      console.error('Erro ao carregar mais Pokémons:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [allPokemonNames, loadingMore]);

  // Select a pokemon and load its full details + evolutions
  const selectPokemon = useCallback(async (pokemon: Pokemon) => {
    // Check cache
    if (detailCacheRef.current.has(pokemon.name.toLowerCase())) {
      const cached = detailCacheRef.current.get(pokemon.name.toLowerCase())!;
      setSelectedPokemon(cached);

      // Find index in list
      setPokemonList((prev) => {
        const idx = prev.findIndex((p) => p.id === cached.id);
        setSelectedPokemonIndex(idx >= 0 ? idx : -1);
        return prev;
      });
      return;
    }

    try {
      // Fetch full details
      const fullDetails = await fetchPokemonDetails(
        `${POKEAPI_BASE}/pokemon/${pokemon.id}`
      );

      // Fetch evolutions
      const speciesUrl = `${POKEAPI_BASE}/pokemon-species/${pokemon.id}`;
      const evolutions = await fetchEvolutionChain(speciesUrl);

      fullDetails.evolutions = evolutions;

      // Cache it
      detailCacheRef.current.set(pokemon.name.toLowerCase(), fullDetails);

      setSelectedPokemon(fullDetails);

      // Find index in list
      setPokemonList((prev) => {
        const idx = prev.findIndex((p) => p.id === fullDetails.id);
        setSelectedPokemonIndex(idx >= 0 ? idx : -1);
        return prev;
      });
    } catch (error) {
      console.error('Erro ao selecionar Pokémon:', error);
      setSelectedPokemon(pokemon);
    }
  }, []);

  // Search for Pokémon by name
  const searchPokemon = useCallback(async (searchTerm: string) => {
    if (searchTerm.length === 0) {
      // Reset to first 50
      try {
        setSearching(true);
        const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=1500&offset=0`);
        const data = await response.json();
        setAllPokemonNames(data.results);

        const first50 = data.results.slice(0, 50);
        const details = await Promise.all(
          first50.map((p: PokemonName) => fetchPokemonDetails(p.url))
        );
        setPokemonList(details);

        if (details.length > 0) {
          setSelectedPokemon(details[0]);
          setSelectedPokemonIndex(0);
        }
      } catch (error) {
        console.error('Erro ao buscar Pokémons:', error);
      } finally {
        setSearching(false);
      }
      return;
    }

    try {
      setSearching(true);
      const response = await fetch(
        `${POKEAPI_BASE}/pokemon/${searchTerm.toLowerCase().trim()}`
      );

      if (response.ok) {
        const details = await response.json();
        const pokemon: Pokemon = {
          id: details.id,
          name: details.name.charAt(0).toUpperCase() + details.name.slice(1),
          image:
            details.sprites.other['official-artwork'].front_default ||
            details.sprites.front_default,
          shinyImage:
            details.sprites.other['official-artwork'].front_shiny ||
            details.sprites.front_shiny,
          types: details.types.map((t: any) => t.type.name),
          height: details.height / 10,
          weight: details.weight / 10,
          stats: details.stats.map((s: any) => ({
            name: s.stat.name.toUpperCase().replace('-', ' '),
            value: s.base_stat,
          })),
          abilities: details.abilities.map((a: any) => a.ability.name),
          evolutions: [],
        };

        // Fetch evolutions
        const speciesUrl = `${POKEAPI_BASE}/pokemon-species/${pokemon.id}`;
        pokemon.evolutions = await fetchEvolutionChain(speciesUrl);

        detailCacheRef.current.set(pokemon.name.toLowerCase(), pokemon);

        setPokemonList([pokemon]);
        setSelectedPokemon(pokemon);
        setSelectedPokemonIndex(0);
      } else {
        // Try partial name match from the full list
        const matches = allPokemonNames.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
        if (matches.length > 0) {
          const details = await Promise.all(
            matches.slice(0, 50).map((p) => fetchPokemonDetails(p.url))
          );
          setPokemonList(details);
          if (details.length > 0) {
            setSelectedPokemon(details[0]);
            setSelectedPokemonIndex(0);
          }
        } else {
          setPokemonList([]);
          setSelectedPokemon(null);
          setSelectedPokemonIndex(-1);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      // Fallback: search in already loaded list
      const localMatch = pokemonList.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
      if (localMatch.length > 0) {
        setPokemonList(localMatch);
        setSelectedPokemon(localMatch[0]);
        setSelectedPokemonIndex(0);
      }
    } finally {
      setSearching(false);
    }
  }, [allPokemonNames, pokemonList]);

  const goToPrevious = useCallback(() => {
    setSelectedPokemonIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : pokemonList.length - 1;
      if (pokemonList[newIndex]) {
        selectPokemon(pokemonList[newIndex]);
      }
      return newIndex;
    });
  }, [pokemonList, selectPokemon]);

  const goToNext = useCallback(() => {
    setSelectedPokemonIndex((prev) => {
      const newIndex = prev < pokemonList.length - 1 ? prev + 1 : 0;
      if (pokemonList[newIndex]) {
        selectPokemon(pokemonList[newIndex]);
      }
      return newIndex;
    });
  }, [pokemonList, selectPokemon]);

  return {
    pokemonList,
    allPokemonNames,
    loading,
    searching,
    loadingMore,
    selectedPokemon,
    selectedPokemonIndex,
    selectPokemon,
    searchPokemon,
    goToPrevious,
    goToNext,
    loadMore,
  };
}
