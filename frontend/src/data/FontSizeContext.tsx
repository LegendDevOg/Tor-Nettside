import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FontSizeContextType {
  scale: number;
  increaseSize: () => void;
  decreaseSize: () => void;
  resetSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

const MIN_SCALE = 0.5;
const MAX_SCALE = 1.45;
const STEP = 0.15;
const DEFAULT_SCALE = 1;

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState<number>(() => {
    // Load from localStorage on initial render
    const savedScale = localStorage.getItem('fontSize');
    return savedScale ? parseFloat(savedScale) : DEFAULT_SCALE;
  });

  // Save to localStorage whenever scale changes
  useEffect(() => {
    localStorage.setItem('fontSize', scale.toString());
  }, [scale]);

  const increaseSize = () => {
    setScale((prev) => Math.min(prev + STEP, MAX_SCALE));
  };

  const decreaseSize = () => {
    setScale((prev) => Math.max(prev - STEP, MIN_SCALE));
  };

  const resetSize = () => {
    setScale(DEFAULT_SCALE);
  };

  return (
    <FontSizeContext.Provider value={{ scale, increaseSize, decreaseSize, resetSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}

