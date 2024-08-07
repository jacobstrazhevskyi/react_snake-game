import {
  Dispatch,
  SetStateAction,
  useEffect, 
  useState,
} from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
): [T, SetValue<T>] => {
  const [value, setValue] = useState<T>(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(localStorage.getItem(key) || String(defaultValue));
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;
