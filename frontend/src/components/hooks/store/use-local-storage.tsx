import { useState } from 'react';

function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const getInitialValue = (): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        try {
          return JSON.parse(storedValue);
        } catch {
          return storedValue as unknown as T;
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }

    return defaultValue;
  };

  const [value, setValue] = useState<T>(getInitialValue);

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        const valueToStore =
          typeof newValue === 'string'
            ? newValue
            : JSON.stringify(newValue);
        localStorage.setItem(key, valueToStore);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
}

export default useLocalStorage;
