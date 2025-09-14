import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check localStorage and system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="relative overflow-hidden transition-all duration-300 hover:shadow-glow"
    >
      <div className="relative z-10 flex items-center">
        {theme === 'light' ? (
          <Moon className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-primary opacity-0 transition-opacity duration-300 hover:opacity-10" />
    </Button>
  );
};

export default ThemeToggle;