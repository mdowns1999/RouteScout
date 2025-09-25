import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#2E4057', // Your primaryColor
    },
    secondary: {
      main: '#2E8B57', // Your accentOne
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    h1: { fontFamily: '"Source Sans 3", sans-serif' },
    h2: { fontFamily: '"Source Sans 3", sans-serif' },
    h3: { fontFamily: '"Source Sans 3", sans-serif' },
    h4: { fontFamily: '"Source Sans 3", sans-serif' },
    h5: { fontFamily: '"Source Sans 3", sans-serif' },
    h6: { fontFamily: '"Source Sans 3", sans-serif' },
  },
});

export default theme;
