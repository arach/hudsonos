'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { DEFAULTS, type StudioState } from './defaults';

interface StudioContextValue {
  state: StudioState;
  setState: (patch: Partial<StudioState> | ((prev: StudioState) => StudioState)) => void;
  set: <K extends keyof StudioState>(key: K, value: StudioState[K]) => void;
  reset: () => void;
}

const StudioContext = createContext<StudioContextValue | undefined>(undefined);

export function StudioProvider({
  initial,
  children,
}: {
  initial?: StudioState;
  children: ReactNode;
}) {
  const [state, setStateInternal] = useState<StudioState>(() => ({ ...DEFAULTS, ...initial }));

  const setState = useCallback(
    (patch: Partial<StudioState> | ((prev: StudioState) => StudioState)) => {
      setStateInternal((prev) => (typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }));
    },
    [],
  );

  const set = useCallback(<K extends keyof StudioState>(key: K, value: StudioState[K]) => {
    setStateInternal((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setStateInternal({ ...DEFAULTS }), []);

  return (
    <StudioContext.Provider value={{ state, setState, set, reset }}>{children}</StudioContext.Provider>
  );
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider');
  return ctx;
}
