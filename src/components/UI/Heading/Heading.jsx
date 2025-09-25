/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const headingTheme = createTheme({
  typography: {
    h1: {
      fontSize: "clamp(1.5rem, 4vw, 2.5rem)", // Smaller: was 2rem-3.5rem
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "clamp(1.25rem, 3vw, 2rem)", // Smaller: was 1.75rem-2.5rem
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)", // Smaller: was 1.5rem-2rem
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "clamp(1rem, 2vw, 1.25rem)", // Smaller: was 1.25rem-1.5rem
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)", // Smaller: was 1.125rem-1.25rem
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "clamp(0.75rem, 1.5vw, 1rem)", // Smaller: was 1rem-1.125rem
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const headingCss = css`
  text-align: center;
`;

const Heading = ({
  level = "h1", // Semantic level (h1, h2, etc.)
  size, // Visual size (optional, defaults to level)
  centered = false,
  children,
  ...props
}) => {
  const variantMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
  };

  // Use size for visual appearance, level for semantic meaning
  const visualVariant = variantMap[size || level];
  const semanticElement = `${level}`;

  return (
    <ThemeProvider theme={headingTheme}>
      <Typography
        variant={visualVariant}
        component={semanticElement}
        gutterBottom
        css={centered ? headingCss : null}
        {...props}
      >
        {children}
      </Typography>
    </ThemeProvider>
  );
};

export default Heading;
