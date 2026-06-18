import { ChevronLeft, ChevronRight } from 'lucide-react';
import PokedexScreen from './PokedexScreen';

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

interface PokedexBodyProps {
  pokemon: Pokemon | null;
  loading: boolean;
  eyeLeftRef: React.RefObject<HTMLDivElement>;
  eyeRightRef: React.RefObject<HTMLDivElement>;
  onPrevious: () => void;
  onNext: () => void;
  canNavigate: boolean;
}

export default function PokedexBody({
  pokemon,
  loading,
  eyeLeftRef,
  eyeRightRef,
  onPrevious,
  onNext,
  canNavigate,
}: PokedexBodyProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Side Hugs (Abraços laterais do anime) */}
      <div className="pokedex-hug-left hidden lg:block"></div>
      <div className="pokedex-hug-right hidden lg:block"></div>

      <div className="pokedex-body w-full p-8">
        {/* Top Section with Eyes */}
        <div className="flex justify-between items-center mb-6">
          <div ref={eyeLeftRef} className="pokedex-eye"></div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              ROTOM
            </h1>
            <p className="text-white text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              POKÉDEX
            </p>
          </div>
          <div ref={eyeRightRef} className="pokedex-eye"></div>
        </div>

        {/* Screen Display */}
        <PokedexScreen pokemon={pokemon} loading={loading} />

        {/* Navigation Buttons */}
        {canNavigate && pokemon && (
          <div className="flex justify-between items-center mt-6 px-2">
            <button
              onClick={onPrevious}
              className="nav-button p-2 rounded-full bg-white shadow-lg"
              title="Pokémon anterior"
            >
              <ChevronLeft size={24} className="text-slate-800" />
            </button>
            <span className="text-white font-semibold text-center flex-1 mx-2">
              {pokemon.name}
            </span>
            <button
              onClick={onNext}
              className="nav-button p-2 rounded-full bg-white shadow-lg"
              title="Próximo Pokémon"
            >
              <ChevronRight size={24} className="text-slate-800" />
            </button>
          </div>
        )}

        {/* Bottom Buttons */}
        <div className="flex gap-4 justify-center mt-6">
          <div className="w-8 h-8 bg-red-600 rounded-full shadow-lg"></div>
          <div className="w-8 h-8 bg-yellow-400 rounded-full shadow-lg"></div>
          <div className="w-8 h-8 bg-green-500 rounded-full shadow-lg"></div>
        </div>
      </div>
    </div>
  );
}
