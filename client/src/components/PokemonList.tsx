import { Loader2 } from 'lucide-react';

interface Pokemon {
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

interface PokemonListProps {
  pokemonList: Pokemon[];
  onSelectPokemon: (pokemon: Pokemon) => void;
  searching: boolean;
}

export default function PokemonList({
  pokemonList,
  onSelectPokemon,
  searching,
}: PokemonListProps) {
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {searching ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-slate-600" size={24} />
        </div>
      ) : pokemonList.length > 0 ? (
        pokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            onClick={() => onSelectPokemon(pokemon)}
            className="pokemon-card p-3 flex items-center gap-3"
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-12 h-12 object-contain"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 truncate">
                #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
              </p>
              <p className="text-xs text-slate-600 truncate">
                {pokemon.types.join(', ')}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-slate-600 py-4">Nenhum Pokémon encontrado</p>
      )}
    </div>
  );
}
