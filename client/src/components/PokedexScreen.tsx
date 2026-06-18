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

interface PokedexScreenProps {
  pokemon: Pokemon | null;
  loading: boolean;
}

export default function PokedexScreen({ pokemon, loading }: PokedexScreenProps) {
  return (
    <div className="pokedex-screen p-6 min-h-96">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-slate-600" size={32} />
        </div>
      ) : pokemon ? (
        <div className="fade-in space-y-4">
          {/* Pokémon Image */}
          <div className="flex justify-center mb-4">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-32 h-32 object-contain drop-shadow-lg"
            />
          </div>

          {/* Pokémon Info */}
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
              </h2>
            </div>

            {/* Types */}
            <div className="flex justify-center gap-2 flex-wrap">
              {pokemon.types.map((type) => (
                <span key={type} className="type-badge">
                  {type}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="space-y-2 text-sm">
              {pokemon.stats.slice(0, 3).map((stat) => (
                <div key={stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">{stat.name}</span>
                    <span className="text-slate-600">{stat.value}</span>
                  </div>
                  <div className="pokemon-stat-bar h-2">
                    <div
                      className="pokemon-stat-fill h-full"
                      style={{ width: `${Math.min(stat.value, 150) / 1.5}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Height and Weight */}
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="bg-white bg-opacity-50 rounded p-2">
                <p className="text-slate-600">Height</p>
                <p className="font-bold text-slate-800">{pokemon.height}m</p>
              </div>
              <div className="bg-white bg-opacity-50 rounded p-2">
                <p className="text-slate-600">Weight</p>
                <p className="font-bold text-slate-800">{pokemon.weight}kg</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-600 text-center">Nenhum Pokémon selecionado</p>
        </div>
      )}
    </div>
  );
}
