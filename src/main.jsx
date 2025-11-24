import { StrictMode, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { getTheme } from "./theme.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ThemeModeContext } from "./contexts/ThemeModeContext";

function Root() {
  const [mode, setMode] = useState('light');
  
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  const theme = useMemo(() => getTheme(mode), [mode]);
  
  return (
    <ThemeModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
