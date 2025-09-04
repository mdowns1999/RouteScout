/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const guttersMap = {
  none: "0",
  xs: "0.5rem", // ~4px
  sm: "0.75rem", // ~8px
  md: "1.5rem", // ~16px
  lg: "2rem", // ~24px
  xl: "2.5rem", // ~32px
};

const RowCss = (gutterSize) => css`
  display: flex;
  gap: ${gutterSize};

  @media (max-width: 768px) {
    gap: calc(${gutterSize} / 2);
  }

  &[data-wrap="true"] {
    flex-wrap: wrap;
  }
  &[data-wrap="reverse"] {
    flex-wrap: wrap-reverse;
  }
  &[data-align-x="start"] {
    justify-content: flex-start;
  }
  &[data-align-x="center"] {
    justify-content: center;
  }
  &[data-align-x="end"] {
    justify-content: flex-end;
  }
  &[data-align-y="top"] {
    align-items: flex-start;
  }
  &[data-align-y="middle"] {
    align-items: center;
  }
  &[data-align-y="bottom"] {
    align-items: flex-end;
  }
`;

export default function Row({
  children,
  alignX = "start",
  alignY = "middle",
  gutters = "md",
  wrap,
}) {
  const gutterSize = guttersMap[gutters];
  return (
    <div
      css={RowCss(gutterSize)}
      data-wrap={wrap}
      data-align-x={alignX}
      data-align-y={alignY}
    >
      {children}
    </div>
  );
}
