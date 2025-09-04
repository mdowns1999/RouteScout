/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";

const paragraphCss = css`
  text-align: center;
`;

const Paragraph = ({ centered, children, ...props }) => (
  <Typography variant="body1" component="p" gutterBottom css={centered ? paragraphCss : null} {...props}>
    {children}
  </Typography>
);

export default Paragraph;
