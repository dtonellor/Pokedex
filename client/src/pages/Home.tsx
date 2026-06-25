import { useState } from 'react';
import PokedexBody from '@/components/PokedexBody';
import { usePokemonAPI } from '@/hooks/usePokemonAPI';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showShiny, setShowShiny] = useState(false);
  const [showEvolutions, setShowEvolutions] = useState(false);

  const {
    pokemonList,
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
  } = usePokemonAPI();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    searchPokemon(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    searchPokemon('');
  };

  const handleToggleShiny = () => {
    setShowShiny((prev) => !prev);
  };

  const handleToggleEvolutions = () => {
    setShowEvolutions((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <PokedexBody
          pokemon={selectedPokemon}
          loading={loading}
          pokemonList={pokemonList}
          loadingMore={loadingMore}
          selectedPokemonIndex={selectedPokemonIndex}
          showShiny={showShiny}
          showEvolutions={showEvolutions}
          searchTerm={searchTerm}
          onSelectPokemon={selectPokemon}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClear}
          searching={searching}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onToggleShiny={handleToggleShiny}
          onToggleEvolutions={handleToggleEvolutions}
          onLoadMore={loadMore}
          canNavigate={pokemonList.length > 1}
        />

        {/* Footer */}
        <div className="text-center mt-6 text-slate-600 text-xs">
          <p>Pokédex Interativa © 2026 | Powered by PokeAPI</p>
        </div>
      </div>
    </div>
  );
}
