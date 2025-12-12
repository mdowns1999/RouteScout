import { useState, useMemo } from "react"
import App from "./App"
import { getTheme } from "./theme"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { ThemeModeContext } from "./contexts/ThemeModeContext"
import type { ThemeMode } from "./contexts/ThemeModeContext"

export default function Root() {
  const getInitialMode = (): ThemeMode => {
    // Check localStorage first
    const savedMode = localStorage.getItem("themeMode")
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode
    }

    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    return prefersDark ? "dark" : "light"
  }

  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light"
      localStorage.setItem("themeMode", newMode)
      return newMode
    })
  }

  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <ThemeModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
