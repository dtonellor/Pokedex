import { ChevronLeft, ChevronRight } from 'lucide-react';
import PokedexScreen from './PokedexScreen';
import PokemonList from './PokemonList';
import PokemonSearchBar from './PokemonSearchBar';

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

interface PokedexBodyProps {
  pokemon: Pokemon | null;
  loading: boolean;
  pokemonList: Pokemon[];
  loadingMore: boolean;
  selectedPokemonIndex: number;
  showShiny: boolean;
  showEvolutions: boolean;
  searchTerm: string;
  onSelectPokemon: (pokemon: Pokemon) => void;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  searching: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShiny: () => void;
  onToggleEvolutions: () => void;
  onLoadMore: (startIndex: number, count: number) => void;
  canNavigate: boolean;
}

export default function PokedexBody({
  pokemon,
  loading,
  pokemonList,
  loadingMore,
  selectedPokemonIndex,
  showShiny,
  showEvolutions,
  searchTerm,
  onSelectPokemon,
  onSearchChange,
  onClearSearch,
  searching,
  onPrevious,
  onNext,
  onToggleShiny,
  onToggleEvolutions,
  onLoadMore,
  canNavigate,
}: PokedexBodyProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="ds-shell p-4 md:p-5">
        {/* TOP SECTION: Indicator light + Brand */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="indicator-light bg-green-500"></div>
            <span className="text-white/70 text-[0.6rem] font-bold tracking-widest uppercase">
              Pokédex
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle buttons */}
            <button
              onClick={onToggleShiny}
              className={`ds-toggle ${showShiny ? 'ds-toggle-active' : 'ds-toggle-inactive'}`}
              title="Mostrar forma Shiny"
            >
              ✨ Shiny
            </button>
            <button
              onClick={onToggleEvolutions}
              className={`ds-toggle ${showEvolutions ? 'ds-toggle-active' : 'ds-toggle-inactive'}`}
              title="Mostrar evoluções"
            >
              🔗 Evoluções
            </button>
          </div>
        </div>

        {/* TOP SCREEN */}
        <div className="ds-top-screen p-3 min-h-[340px] md:min-h-[380px]">
          <PokedexScreen
            pokemon={pokemon}
            loading={loading}
            showShiny={showShiny}
            showEvolutions={showEvolutions}
            onSelectPokemon={onSelectPokemon}
          />
        </div>

        {/* HINGE */}
        <div className="ds-hinge my-3"></div>

        {/* NAVIGATION CONTROLS */}
        <div className="flex items-center justify-between px-2 mb-3">
          <button
            onClick={onPrevious}
            className="ds-nav-btn ds-nav-btn-primary"
            disabled={!canNavigate}
            title="Pokémon anterior"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex-1 text-center px-3">
            {pokemon && (
              <span className="text-white font-bold text-sm tracking-wide">
                #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
              </span>
            )}
          </div>

          <button
            onClick={onNext}
            className="ds-nav-btn ds-nav-btn-primary"
            disabled={!canNavigate}
            title="Próximo Pokémon"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* BOTTOM SCREEN LABEL */}
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-white/60 text-[0.6rem] font-bold tracking-widest uppercase">
            Lista de Pokémon
          </span>
          <span className="text-white/40 text-[0.55rem]">
            {pokemonList.length > 0
              ? pokemonIndexLabel(selectedPokemonIndex, pokemonList.length)
              : ''}
          </span>
        </div>

        {/* BOTTOM SCREEN */}
        <div className="ds-bottom-screen p-2">
          {/* Search Bar */}
          <div className="mb-2">
            <PokemonSearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              searching={searching}
              onClear={onClearSearch}
            />
          </div>

          {/* Pokemon List */}
          <div className="h-[200px] md:h-[240px] overflow-y-auto ds-scrollbar pr-1">
            <PokemonList
              pokemonList={pokemonList}
              selectedPokemonId={pokemon?.id}
              onSelectPokemon={onSelectPokemon}
              searching={searching}
              loadingMore={loadingMore}
              onLoadMore={onLoadMore}
              totalCount={pokemonList.length}
            />
          </div>
        </div>

        {/* Bottom decorative dots */}
        <div className="flex gap-3 justify-center mt-3">
          <div className="w-3 h-3 bg-red-600 rounded-full shadow-md border border-red-800"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-md border border-yellow-500"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-md border border-green-600"></div>
        </div>
      </div>
    </div>
  );
}

function pokemonIndexLabel(index: number, total: number): string {
  if (index < 0) return '';
  return `${index + 1} / ${total}`;
}
