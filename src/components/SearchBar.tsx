import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, X } from 'lucide-react';
import { Input } from './ui/input';
import type { GeoSuggestion } from '../types';

const HISTORY_KEY = 'weatherp_history';

interface SearchBarProps {
  onSearch: (city: string) => void;
  getSuggestions: (query: string) => Promise<GeoSuggestion[]>;
}

function formatDistance(km: number): string {
  if (km < 1) return 'Nearby';
  if (km < 1000) return `${Math.round(km)} km`;
  return `${(km / 1000).toFixed(1)}k km`;
}

function loadHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}

function saveToHistory(city: string) {
  const prev = loadHistory();
  const updated = [city, ...prev.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function SearchBar({ onSearch, getSuggestions }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [history, setHistory] = useState<string[]>(loadHistory);
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showHistory = focused && query.trim().length < 2 && history.length > 0;

  // Fetch suggestions with 300ms debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(showHistory);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await getSuggestions(query);
      setSuggestions(results);
      setOpen(results.length > 0);
      setActiveIndex(-1);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, getSuggestions, showHistory]);

  // Keep open state in sync when focus/history change but no query
  useEffect(() => {
    if (query.trim().length < 2) setOpen(showHistory);
  }, [focused, history, showHistory, query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const commitSearch = (city: string) => {
    saveToHistory(city);
    setHistory(loadHistory());
    onSearch(city);
    setQuery('');
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const selectSuggestion = (s: GeoSuggestion) => commitSearch(s.name);

  const removeFromHistory = (city: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = loadHistory().filter(c => c !== city);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex]);
    } else if (query.trim()) {
      commitSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    const listLength = suggestions.length > 0 ? suggestions.length : history.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, listLength - 1));
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
            onFocus={() => setFocused(true)}
            placeholder="Search for a city..."
            className="w-full px-4 py-2 pl-10 bg-white/10 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
            autoComplete="off"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/60" />
        </div>
      </form>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/15 shadow-2xl z-50">

          {/* Recent searches */}
          {showHistory && (
            <>
              <p className="px-4 pt-3 pb-1 text-white/35 text-xs uppercase tracking-widest">Recent</p>
              {history.map((city, i) => (
                <button
                  key={city}
                  onMouseDown={() => commitSearch(city)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors border-b border-white/10 last:border-0 ${
                    i === activeIndex ? 'bg-white/15' : 'hover:bg-white/10'
                  }`}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-white/35 flex-shrink-0" />
                    <span className="text-white/80 font-medium">{city}</span>
                  </div>
                  <span
                    onMouseDown={e => removeFromHistory(city, e)}
                    className="text-white/30 hover:text-white/70 transition-colors p-1 rounded"
                  >
                    <X className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Live suggestions */}
          {suggestions.length > 0 && suggestions.map((s, i) => (
            <button
              key={`${s.lat}-${s.lon}`}
              onMouseDown={() => selectSuggestion(s)}
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
