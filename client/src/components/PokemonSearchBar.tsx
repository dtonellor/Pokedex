import { Search, Loader2, X } from 'lucide-react';

interface PokemonSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searching: boolean;
  onClear: () => void;
}

export default function PokemonSearchBar({
  searchTerm,
  onSearchChange,
  searching,
  onClear,
}: PokemonSearchBarProps) {
  return (
    <div className="flex gap-1.5 items-center">
      <div className="relative flex-1">
        <Search
          className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500"
          size={14}
        />
        {searching && (
          <Loader2
            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 animate-spin"
            size={14}
          />
        )}
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ds-search-input w-full pl-7 pr-7 py-1.5 text-xs"
        />
        {searchTerm && !searching && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <button
        onClick={onClear}
        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-[0.6rem] font-bold transition-all border border-slate-700 hover:border-slate-500 whitespace-nowrap"
        title="Limpar e voltar à lista completa"
      >
        LIMPAR
      </button>
    </div>
  );
}
