import { useState, useEffect, useRef } from 'react';
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

interface PokedexScreenProps {
  pokemon: Pokemon | null;
  loading: boolean;
  showShiny: boolean;
  showEvolutions: boolean;
  onSelectPokemon: (pokemon: Pokemon) => void;
}

function getStatClass(statName: string): string {
  const name = statName.toLowerCase().replace(' ', '-');
  if (name.includes('hp')) return 'stat-hp';
  if (name.includes('attack') && !name.includes('special')) return 'stat-attack';
  if (name.includes('defense') && !name.includes('special')) return 'stat-defense';
  if (name.includes('special') && name.includes('attack')) return 'stat-special-attack';
  if (name.includes('special') && name.includes('defense')) return 'stat-special-defense';
  if (name.includes('speed')) return 'stat-speed';
  return 'stat-hp';
}

export default function PokedexScreen({
  pokemon,
  loading,
  showShiny,
  showEvolutions,
  onSelectPokemon,
}: PokedexScreenProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'info'>('stats');
  const rotationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPokemonIdRef = useRef<number | null>(null);

  // Start rotation when pokemon changes
  useEffect(() => {
    if (pokemon && pokemon.id !== prevPokemonIdRef.current) {
      prevPokemonIdRef.current = pokemon.id;
      setIsRotating(true);

      // Clear previous timer
      if (rotationTimerRef.current) {
        clearTimeout(rotationTimerRef.current);
      }

      // Stop rotation after 5 seconds
      rotationTimerRef.current = setTimeout(() => {
        setIsRotating(false);
      }, 5000);
    }

    return () => {
      if (rotationTimerRef.current) {
        clearTimeout(rotationTimerRef.current);
      }
    };
  }, [pokemon?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-red-500 mx-auto" size={36} />
          <p className="text-slate-400 text-sm mt-3">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <p className="text-slate-500 text-center text-sm">
          Selecione um Pokémon na lista abaixo
        </p>
      </div>
    );
  }

  const displayImage = showShiny ? pokemon.shinyImage : pokemon.image;

  return (
    <div className="fade-in h-full flex flex-col">
      {/* Pokemon Image + Name Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Image */}
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
            <img
              src={displayImage}
              alt={pokemon.name}
              className={`w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${
                isRotating ? 'pokemon-rotate' : ''
              }`}
              key={`${pokemon.id}-${showShiny ? 'shiny' : 'normal'}`}
            />
          </div>
          {showShiny && (
            <div className="absolute -top-1 -right-1">
              <span className="shiny-badge">SHINY</span>
            </div>
          )}
        </div>

        {/* Name + Types */}
        <div className="flex-1 min-w-0 pt-1">
          <h2 className="text-white font-bold text-lg leading-tight truncate">
            {pokemon.name}
          </h2>
          <p className="text-slate-400 text-xs mb-2">
            #{String(pokemon.id).padStart(3, '0')}
          </p>
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map((type) => (
              <span key={type} className={`type-badge type-${type}`}>
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-1.5 text-[0.65rem] font-bold rounded-md transition-all ${
            activeTab === 'stats'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-slate-300'
          }`}
        >
          STATS
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-1.5 text-[0.65rem] font-bold rounded-md transition-all ${
            activeTab === 'info'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-slate-300'
          }`}
        >
          INFO
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto ds-scrollbar">
        {activeTab === 'stats' ? (
          <div className="space-y-1.5">
            {pokemon.stats.map((stat) => (
              <div key={stat.name}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-slate-300 text-[0.65rem] font-medium">
                    {stat.name}
                  </span>
                  <span className="text-white text-[0.65rem] font-bold">
                    {stat.value}
                  </span>
                </div>
                <div className="pokemon-stat-bar h-2">
                  <div
                    className={`pokemon-stat-fill h-full ${getStatClass(stat.name)}`}
                    style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700">
                <p className="text-slate-400 text-[0.6rem] uppercase tracking-wider">Altura</p>
                <p className="text-white font-bold text-sm">{pokemon.height}m</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700">
                <p className="text-slate-400 text-[0.6rem] uppercase tracking-wider">Peso</p>
                <p className="text-white font-bold text-sm">{pokemon.weight}kg</p>
              </div>
            </div>

            {/* Abilities */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
              <p className="text-slate-400 text-[0.6rem] uppercase tracking-wider mb-1">
                Habilidades
              </p>
              <div className="flex flex-wrap gap-1">
                {pokemon.abilities.map((ability) => (
                  <span
                    key={ability}
                    className="text-[0.6rem] bg-slate-700 text-slate-200 px-2 py-0.5 rounded"
                  >
                    {ability.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Evolutions Section */}
        {showEvolutions && pokemon.evolutions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-slate-400 text-[0.6rem] uppercase tracking-wider mb-2">
              Linhagem de Evolução
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {pokemon.evolutions.map((evo, index) => (
                <div key={evo.id} className="flex items-center gap-1">
                  {index > 0 && (
                    <span className="evolution-arrow">→</span>
                  )}
                  <div
                    className={`evolution-card ${
                      evo.id === pokemon.id ? 'current' : ''
                    }`}
                    onClick={() => {
                      if (evo.id !== pokemon.id) {
                        onSelectPokemon({
                          ...pokemon,
                          id: evo.id,
                          name: evo.name,
                        });
                      }
                    }}
                  >
                    <img
                      src={evo.image}
                      alt={evo.name}
                      className="w-10 h-10 object-contain mx-auto"
                    />
                    <p className="text-[0.5rem] text-slate-300 text-center mt-0.5 truncate max-w-[50px]">
                      {evo.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
