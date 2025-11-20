import { useState, useCallback } from 'react';

/**
 * Hook to toggle boolean value
 * @param initialValue - Initial boolean value
 * @returns [value, toggle, setValue]
 */
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setValue, setTrue, setFalse] as const;
};

