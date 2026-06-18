import { useState, useEffect, useCallback, useRef } from 'react';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  stats: Array<{
    name: string;
    value: number;
  }>;
  abilities: string[];
}

export function usePokemonAPI() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const initialLoadRef = useRef(false);

  // Fetch initial Pokémon list
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const fetchInitialPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              id: details.id,
              name: details.name.charAt(0).toUpperCase() + details.name.slice(1),
              image:
                details.sprites.other['official-artwork'].front_default ||
                details.sprites.front_default,
              types: details.types.map((t: any) => t.type.name),
              height: details.height / 10,
              weight: details.weight / 10,
              stats: details.stats.map((s: any) => ({
                name: s.stat.name.toUpperCase().replace('-', ' '),
                value: s.base_stat,
              })),
              abilities: details.abilities.map((a: any) => a.ability.name),
            };
          })
        );

        setPokemonList(pokemonDetails);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Erro ao buscar Pokémons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPokemon();
  }, []);

  // Search for Pokémon by name
  const searchPokemon = useCallback(async (searchTerm: string) => {
    if (searchTerm.length === 0) {
      // Reset to initial list
      try {
        setSearching(true);
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              id: details.id,
              name: details.name.charAt(0).toUpperCase() + details.name.slice(1),
              image:
                details.sprites.other['official-artwork'].front_default ||
                details.sprites.front_default,
              types: details.types.map((t: any) => t.type.name),
              height: details.height / 10,
              weight: details.weight / 10,
              stats: details.stats.map((s: any) => ({
                name: s.stat.name.toUpperCase().replace('-', ' '),
                value: s.base_stat,
              })),
              abilities: details.abilities.map((a: any) => a.ability.name),
            };
          })
        );

        setPokemonList(pokemonDetails);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Erro ao buscar Pokémons:', error);
      } finally {
        setSearching(false);
      }
      return;
    }

    try {
      setSearching(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);

      if (response.ok) {
        const details = await response.json();
        const pokemon: Pokemon = {
          id: details.id,
          name: details.name.charAt(0).toUpperCase() + details.name.slice(1),
          image:
            details.sprites.other['official-artwork'].front_default ||
            details.sprites.front_default,
          types: details.types.map((t: any) => t.type.name),
          height: details.height / 10,
          weight: details.weight / 10,
          stats: details.stats.map((s: any) => ({
            name: s.stat.name.toUpperCase().replace('-', ' '),
            value: s.base_stat,
          })),
          abilities: details.abilities.map((a: any) => a.ability.name),
        };

        setPokemonList([pokemon]);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
    } finally {
      setSearching(false);
    }
  }, []);

  const getCurrentPokemon = useCallback(() => {
    return pokemonList[currentIndex] || null;
  }, [pokemonList, currentIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : pokemonList.length - 1));
  }, [pokemonList.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < pokemonList.length - 1 ? prev + 1 : 0));
  }, [pokemonList.length]);

  return {
    pokemonList,
    loading,
    searching,
    currentIndex,
    getCurrentPokemon,
    searchPokemon,
    goToPrevious,
    goToNext,
  };
}
