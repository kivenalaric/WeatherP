import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full px-4 py-2 pl-10 bg-white/10 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/60" />
      </div>
    </form>
  );
}