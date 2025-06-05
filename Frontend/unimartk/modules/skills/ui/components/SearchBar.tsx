import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  hasFilters: boolean;
}

export function SearchBar({ value, onChange, onClear, hasFilters }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <Input
        type="text"
        placeholder="Search services and skills..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-slate-50 py-3 pl-10 pr-10 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:ring-blue-600"
        aria-label="Search services"
      />
      {hasFilters && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          onClick={onClear}
          aria-label="Clear search and filters"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}