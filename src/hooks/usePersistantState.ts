import { useEffect, useState, useRef } from "react";

export default function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const prevValue = useRef(state); 

  useEffect(() => {
    const handleChange = (e: StorageEvent) => {
      if (e.key === key) {
        const newValue = e.newValue ? JSON.parse(e.newValue) : null;
        if (newValue !== prevValue.current) {
          setState(newValue);
          prevValue.current = newValue;
        }
      }
    };

    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener("storage", handleChange);
    };
  }, [key]); 

  const updateState = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
    setState(value);
    prevValue.current = value;
  };

  return [state, updateState];
}