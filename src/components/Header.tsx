import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  city: string;
  region: string;
}

export function Header({ city, region }: HeaderProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    // Check localStorage first, then fallback to light
    return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Set initial theme on mount
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">{city}</h2>
        <p className="text-white/80">{region}</p>
      </div>
      <Button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label={theme === 'light' ? "Switch to dark theme" : "Switch to light theme"}
      >
        {theme === 'light' ? (
          <Sun className="w-6 h-6 text-white" />
        ) : (
          <Moon className="w-6 h-6 text-white" />
        )}
      </Button>
    </header>
  );
}