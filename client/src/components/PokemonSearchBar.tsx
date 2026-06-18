import { Input } from '@/components/ui/input';
import { Search, Loader2, RotateCcw } from 'lucide-react';

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
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        {searching && (
          <Loader2 className="absolute right-3 top-3 text-slate-400 animate-spin" size={20} />
        )}
        <Input
          type="text"
          placeholder="Pesquise um Pokémon..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input pl-10 py-2 w-full text-slate-800 placeholder-slate-400"
        />
      </div>
      <button
        onClick={() => onClear()}
        className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
        title="Voltar à lista completa"
      >
        <RotateCcw size={16} />
        Limpar Pesquisa
      </button>
    </div>
  );
}
