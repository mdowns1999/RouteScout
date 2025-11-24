import { createContext, useContext } from 'react';

export const ThemeModeContext = createContext({
  mode: 'light',
  toggleColorMode: () => {},
});

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeContext.Provider');
  }
  return context;
};
