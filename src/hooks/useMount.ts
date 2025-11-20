import { useEffect } from 'react';

/**
 * Hook that runs callback on mount
 * @param callback - Callback function
 */
export const useMount = (callback: () => void | (() => void)) => {
  useEffect(() => {
    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

