import { useState, useEffect } from 'react';
import { usePlatform } from '../platform/PlatformContext';

export function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { isSSR } = usePlatform();

  const [state, setState] = useState<T>(() => {
    if (!isSSR) {
      try {
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initialValue;
  });

  useEffect(() => {
    if (!isSSR) return;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch {}
  }, [key, isSSR]);

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);

  return [state, setState];
}
