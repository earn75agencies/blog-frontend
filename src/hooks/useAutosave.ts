import { useEffect, useRef, useCallback } from 'react';

// Simple debounce implementation with cancel method
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  } as ((...args: Parameters<T>) => void) & { cancel: () => void };
  
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  return debounced;
}

interface UseAutosaveOptions {
  data: any;
  onSave: (data: any) => Promise<void> | void;
  interval?: number;
  enabled?: boolean;
  storageKey?: string;
}

export const useAutosave = ({
  data,
  onSave,
  interval = 30000, // 30 seconds
  enabled = true,
  storageKey,
}: UseAutosaveOptions) => {
  const lastSavedRef = useRef<Date | null>(null);
  const isSavingRef = useRef(false);
  const dataRef = useRef(data);

  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Restore from localStorage on mount if storageKey provided
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            // Restore if less than 24 hours old
            return parsed.data;
          } else {
            localStorage.removeItem(storageKey);
          }
        }
      } catch (error) {
        console.error('Failed to restore autosave:', error);
      }
    }
  }, [storageKey]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (dataToSave: any) => {
      if (isSavingRef.current || !enabled) return;

      isSavingRef.current = true;
      try {
        const result = onSave(dataToSave);
        // Only await if it's a Promise
        if (result instanceof Promise) {
          await result;
        }
        lastSavedRef.current = new Date();

        // Save to localStorage if storageKey provided
        if (storageKey && typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              storageKey,
              JSON.stringify({
                data: dataToSave,
                timestamp: Date.now(),
              })
            );
          } catch (error) {
            console.warn('Failed to save to localStorage:', error);
          }
        }
      } catch (error) {
        console.error('Autosave failed:', error);
      } finally {
        isSavingRef.current = false;
      }
    }, 1000), // Wait 1 second after last change before saving
    [onSave, enabled, storageKey]
  );

  // Save on data change
  useEffect(() => {
    if (!enabled) return;

    debouncedSave(data);

    return () => {
      debouncedSave.cancel();
    };
  }, [data, debouncedSave, enabled]);

  // Periodic save
  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      if (dataRef.current && !isSavingRef.current) {
        debouncedSave(dataRef.current);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval, debouncedSave, enabled]);

  // Save on page unload
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      if (dataRef.current && !isSavingRef.current) {
        // Use sendBeacon for reliable save on unload
        if (navigator.sendBeacon && storageKey) {
          const blob = new Blob(
            [JSON.stringify({ data: dataRef.current, timestamp: Date.now() })],
            { type: 'application/json' }
          );
          navigator.sendBeacon(`/api/autosave/${storageKey}`, blob);
        } else {
          // Fallback: synchronous save (may block navigation)
          debouncedSave.cancel();
          onSave(dataRef.current).catch(console.error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, storageKey, onSave, debouncedSave]);

  return {
    lastSaved: lastSavedRef.current,
    isSaving: isSavingRef.current,
  };
};

