"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);
  const [storedKey, setStoredKey] = useState(key);
  const initialValueRef = useRef(initialValue);

  if (key !== storedKey) {
    setStoredKey(key);
    setReady(false);
  }

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        setValue(initialValueRef.current);
      } else {
        const parsed = JSON.parse(raw) as T;
        const fallback = initialValueRef.current;
        if (Array.isArray(fallback) && !Array.isArray(parsed)) {
          setValue(fallback);
        } else {
          setValue(parsed);
        }
      }
    } catch {
      setValue(initialValueRef.current);
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable or over quota. Keep the in-memory value.
    }
  }, [key, ready, value]);

  return [value, setValue];
}
