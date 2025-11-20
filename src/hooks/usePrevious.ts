import { useRef, useEffect } from 'react';

/**
 * Hook to get previous value
 * @param value - Current value
 * @returns Previous value
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

