import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import type { GeoSuggestion } from '../types';

interface SearchBarProps {
  onSearch: (city: string) => void;
  getSuggestions: (query: string) => Promise<GeoSuggestion[]>;
}

function formatDistance(km: number): string {
  if (km < 1) return 'Nearby';
  if (km < 1000) return `${Math.round(km)} km`;
  return `${(km / 1000).toFixed(1)}k km`;
}

export function SearchBar({ onSearch, getSuggestions }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch suggestions with 300ms debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await getSuggestions(query);
      setSuggestions(results);
      setOpen(results.length > 0);
      setActiveIndex(-1);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, getSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (suggestion: GeoSuggestion) => {
    onSearch(suggestion.name);
    setQuery('');
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      select(suggestions[activeIndex]);
    } else if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="mb-6 relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Search for a city..."
            className="w-full px-4 py-2 pl-10 bg-white/10 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
            autoComplete="off"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/60" />
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/15 shadow-2xl z-50">
          {suggestions.map((s, i) => (
            <button
              key={`${s.lat}-${s.lon}`}
              onMouseDown={() => select(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors border-b border-white/10 last:border-0 ${
                i === activeIndex ? 'bg-white/15' : 'hover:bg-white/10'
              }`}
              style={{ backgroundColor: 'transparent' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className="w-4 h-4 text-white/40 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-white font-medium truncate block">{s.name}</span>
                  <span className="text-white/50 text-xs">
                    {s.state ? `${s.state}, ` : ''}{s.country}
                  </span>
                </div>
              </div>
              {s.distanceKm !== undefined && (
                <span
                  className="text-xs font-medium flex-shrink-0 px-2 py-0.5 rounded-full"
                  style={{
                    background: s.distanceKm < 50 ? 'rgba(14,165,233,0.25)' : 'rgba(255,255,255,0.1)',
                    color: s.distanceKm < 50 ? '#7dd3fc' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {formatDistance(s.distanceKm)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
