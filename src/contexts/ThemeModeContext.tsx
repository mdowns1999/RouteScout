import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark'

export interface ThemeModeContextType {
  mode: ThemeMode
  toggleColorMode: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined)

export const useThemeMode = (): ThemeModeContextType => {
  const context = useContext(ThemeModeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeContext.Provider')
  }
  return context
}
