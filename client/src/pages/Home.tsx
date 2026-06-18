import { useState, useRef } from 'react';
import PokedexBody from '@/components/PokedexBody';
import PokemonSearchBar from '@/components/PokemonSearchBar';
import PokemonList from '@/components/PokemonList';
import { usePokemonAPI } from '@/hooks/usePokemonAPI';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const eyeLeftRef = useRef<HTMLDivElement | null>(null);
  const eyeRightRef = useRef<HTMLDivElement | null>(null);

  const {
    pokemonList,
    loading,
    searching,
    currentIndex,
    getCurrentPokemon,
    searchPokemon,
    goToPrevious,
    goToNext,
  } = usePokemonAPI();

  const currentPokemon = getCurrentPokemon();

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    searchPokemon(value);
  };

  // Handle Pokémon selection
  const handleSelectPokemon = (pokemon: any) => {
    // Trigger eye glow animation
    triggerEyeGlow();
    // Don't change the list, just keep it showing all Pokémons
  };

  // Trigger eye glow animation
  const triggerEyeGlow = () => {
    if (eyeLeftRef.current && eyeRightRef.current) {
      eyeLeftRef.current.classList.remove('glowing');
      eyeRightRef.current.classList.remove('glowing');

      // Trigger reflow to restart animation
      void eyeLeftRef.current.offsetWidth;
      void eyeRightRef.current.offsetWidth;

      eyeLeftRef.current.classList.add('glowing');
      eyeRightRef.current.classList.add('glowing');

      // Remove class after animation
      setTimeout(() => {
        eyeLeftRef.current?.classList.remove('glowing');
        eyeRightRef.current?.classList.remove('glowing');
      }, 600);
    }
  };

  // Handle navigation with eye glow
  const handlePrevious = () => {
    goToPrevious();
    triggerEyeGlow();
  };

  const handleNext = () => {
    goToNext();
    triggerEyeGlow();
  };

  // Handle clear search
  const handleClear = () => {
    setSearchTerm('');
    searchPokemon(''); // Reset to initial list
    // Reset Pokédex to first Pokémon
    if (pokemonList.length > 0) {
      // The list will show the first Pokémon
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
          {/* Rotom Pokédex */}
          <div className="lg:col-span-2 flex justify-center">
            <PokedexBody
              pokemon={currentPokemon}
              loading={loading}
            eyeLeftRef={eyeLeftRef as React.RefObject<HTMLDivElement>}
            eyeRightRef={eyeRightRef as React.RefObject<HTMLDivElement>}
              onPrevious={handlePrevious}
              onNext={handleNext}
              canNavigate={pokemonList.length > 1}
            />
          </div>

          {/* Search and Pokémon List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search Input */}
            <PokemonSearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              searching={searching}
              onClear={handleClear}
            />

            {/* Pokémon List */}
            <PokemonList
              pokemonList={pokemonList}
              onSelectPokemon={handleSelectPokemon}
              searching={searching}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-600 text-sm">
          <p>Rotom Pokédex © 2026 | Powered by PokeAPI</p>
        </div>
      </div>
    </div>
  );
}
