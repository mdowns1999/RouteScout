import { createTheme } from '@mui/material/styles'
import type { ThemeMode } from './contexts/ThemeModeContext'

export const getTheme = (mode: ThemeMode) => createTheme({
  cssVariables: true,
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#2E4057' : '#9cafb7',
    },
    secondary: {
      main: mode === 'light' ? '#2E8B57' : '#00B894',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: mode === 'light' ? '#ffffff' : '#1A1A2E',
      paper: mode === 'light' ? '#f5f5f5' : '#2E2E2E',
    },
  },
  typography: {
    fontSize: 18,
    fontFamily: '"Montserrat", sans-serif',
    h1: { fontFamily: '"Source Sans 3", sans-serif' },
    h2: { fontFamily: '"Source Sans 3", sans-serif' },
    h3: { fontFamily: '"Source Sans 3", sans-serif' },
    h4: { fontFamily: '"Source Sans 3", sans-serif' },
    h5: { fontFamily: '"Source Sans 3", sans-serif' },
    h6: { fontFamily: '"Source Sans 3", sans-serif' },
  },
})

const theme = getTheme('light')
export default theme
