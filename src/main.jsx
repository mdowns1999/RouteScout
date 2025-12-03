import { StrictMode, useState, useMemo } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { getTheme } from "./theme.jsx"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { ThemeModeContext } from "./contexts/ThemeModeContext"
import "./index.css"

function Root() {
  const getInitialMode = () => {
    // Check localStorage first
    const savedMode = localStorage.getItem("themeMode")
    if (savedMode) {
      return savedMode
    }

    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    return prefersDark ? "dark" : "light"
  }

  const [mode, setMode] = useState(getInitialMode)

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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
