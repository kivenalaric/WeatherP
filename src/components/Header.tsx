import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  city: string;
  region: string;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
}

export function Header({ city, region, unit, onToggleUnit }: HeaderProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">{city}</h2>
        <p className="text-white/80">{region}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleUnit}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-semibold tracking-wide"
          style={{ backgroundColor: 'transparent' }}
          aria-label={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
        >
          °{unit === 'C' ? 'F' : 'C'}
        </button>
        <Button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {theme === 'light' ? (
            <Moon className="w-6 h-6 text-white" />
          ) : (
            <Sun className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
    </header>
  );
}
