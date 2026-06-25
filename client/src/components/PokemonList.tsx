import { Loader2 } from 'lucide-react';

interface Pokemon {
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

interface PokemonListProps {
  pokemonList: Pokemon[];
  selectedPokemonId?: number;
  onSelectPokemon: (pokemon: Pokemon) => void;
  searching: boolean;
  loadingMore: boolean;
  onLoadMore: (startIndex: number, count: number) => void;
  totalCount: number;
}

export default function PokemonList({
  pokemonList,
  selectedPokemonId,
  onSelectPokemon,
  searching,
  loadingMore,
  onLoadMore,
  totalCount,
}: PokemonListProps) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      if (!loadingMore && pokemonList.length < totalCount) {
        onLoadMore(pokemonList.length, 50);
      }
    }
  };

  if (searching) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="animate-spin text-red-500" size={24} />
        <span className="text-slate-400 text-xs ml-2">Pesquisando...</span>
      </div>
    );
  }

  if (pokemonList.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-slate-500 text-xs">Nenhum Pokémon encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-1" onScroll={handleScroll}>
      {pokemonList.map((pokemon) => (
        <div
          key={pokemon.id}
          onClick={() => onSelectPokemon(pokemon)}
          className={`pokemon-list-item ${
            pokemon.id === selectedPokemonId ? 'selected' : ''
          }`}
        >
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-8 h-8 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-xs font-semibold truncate leading-tight">
              #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
            </p>
            <div className="flex gap-0.5 mt-0.5">
              {pokemon.types.slice(0, 2).map((type) => (
                <span
                  key={type}
                  className={`type-badge type-${type}`}
                  style={{ fontSize: '0.5rem', padding: '0.05rem 0.3rem' }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {loadingMore && (
        <div className="flex justify-center py-3">
          <Loader2 className="animate-spin text-red-500" size={16} />
          <span className="text-slate-500 text-[0.6rem] ml-2">Carregando mais...</span>
        </div>
      )}

      {pokemonList.length >= totalCount && pokemonList.length > 0 && (
        <div className="text-center py-2">
          <span className="text-slate-600 text-[0.55rem]">
            Todos os {totalCount} Pokémon carregados
          </span>
        </div>
      )}
    </div>
  );
}
