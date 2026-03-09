import { createTheme } from "@mui/material/styles"
import type { ThemeMode } from "./contexts/ThemeModeContext"

// Extend MUI theme types for custom palette properties
declare module "@mui/material/styles" {
  interface Palette {
    accent: {
      vintage: string
      vintageLight: string
    }
  }
  interface PaletteOptions {
    accent?: {
      vintage?: string
      vintageLight?: string
    }
  }
  interface TypeBackground {
    paperSecondary: string
  }
}

export const getTheme = (mode: ThemeMode) =>
  createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#2e6f95" : "#6ba3c6", // Ocean Blue
        light: mode === "light" ? "#5b95b8" : "#9dc4da",
        dark: mode === "light" ? "#1f4f6a" : "#4a8aad",
        contrastText: mode === "light" ? "#ffffff" : "#000000",
      },
      secondary: {
        main: mode === "light" ? "#3f7d58" : "#5ca582", // Palm Green
        light: mode === "light" ? "#6b9d7f" : "#8bc4a6",
        dark: mode === "light" ? "#2c5940" : "#3f8763",
        contrastText: "#ffffff",
      },
      error: {
        main: mode === "light" ? "#d6594d" : "#e07b72", // Adventure Red
        light: mode === "light" ? "#e07b72" : "#ec9d96",
        dark: mode === "light" ? "#b23e33" : "#c95d51",
      },
      warning: {
        main: mode === "light" ? "#f4b942" : "#f7cb6d", // Golden Sun
        light: mode === "light" ? "#f7cb6d" : "#fad991",
        dark: mode === "light" ? "#d69e25" : "#f0b744",
      },
      background: {
        default: mode === "light" ? "#f6f1e9" : "#1a1a1e", // Passport Cream (light) / Warm dark (dark)
        paper: mode === "light" ? "#ffffff" : "#2a2a2e",
        paperSecondary: mode === "light" ? "#e6c79c" : "#3a3530", // Sandstone
      },
      accent: {
        vintage: mode === "light" ? "#8b5e3c" : "#a67a5a", // Vintage Luggage Brown
        vintageLight: mode === "light" ? "#a67a5a" : "#c49b7f",
      },
    },
    typography: {
      fontSize: 16,
      fontFamily: '"Montserrat", sans-serif',
      h1: { fontFamily: '"Source Sans 3", sans-serif' },
      h2: { fontFamily: '"Source Sans 3", sans-serif' },
      h3: { fontFamily: '"Source Sans 3", sans-serif' },
      h4: { fontFamily: '"Source Sans 3", sans-serif' },
      h5: { fontFamily: '"Source Sans 3", sans-serif' },
      h6: { fontFamily: '"Source Sans 3", sans-serif' },
    },
  })

const theme = getTheme("light")
export default theme
