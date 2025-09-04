/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";

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
    <Typography
      variant={visualVariant}
      component={semanticElement}
      gutterBottom
      css={centered ? headingCss : null}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default Heading;
