import { useEffect, useRef } from 'react';

/**
 * Hook that runs callback on unmount
 * @param callback - Callback function
 */
export const useUnmount = (callback: () => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
};

