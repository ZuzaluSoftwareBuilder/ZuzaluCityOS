import { useState } from 'react';

export enum Theme {
  Dark = 'dark',
  Light = 'light',
}

export default function useTheme(
  defaultTheme: Theme,
): [Theme, React.Dispatch<React.SetStateAction<Theme>>] {
  const [theme, setTheme] = useState(defaultTheme);
  return [theme, setTheme];
}
