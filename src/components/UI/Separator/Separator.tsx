/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

const spacingMap = {
  nano: css`
    height: 0.25rem; /* 2px */
  `,
  xxs: css`
    height: 0.5rem; /* 4px */
  `,
  xs: css`
    height: 1rem; /* 8px */
  `,
  sm: css`
    height: 2rem; /* 16px */
  `,
  md: css`
    height: 2.5rem; /* 24px */
  `,
  lg: css`
    height: 3rem; /* 32px */
  `,
  xl: css`
    height: 4rem; /* 48px */
  `,
  xxl: css`
    height: 5rem; /* 64px */
  `,

  // Responsive sizes
  responsive: css`
    height: 1rem;

    @media (min-width: 768px) {
      height: 2rem;
    }

    @media (min-width: 1024px) {
      height: 3rem;
    }
  `,

  section: css`
    height: 2rem;

    @media (min-width: 768px) {
      height: 4rem;
    }

    @media (min-width: 1024px) {
      height: 6rem;
    }
  `,
}

const separatorStyles = css`
  width: 100%;
  display: block;
`

const lineStyles = css`
  width: 100%;
  height: 1px;
  background-color: #e5e7eb;
  border: none;
  margin: 0;
`

type SeparatorSize =
  | "nano"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "responsive"
  | "section";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SeparatorSize;
  showLine?: boolean;
  lineColor?: string;
}

export default function Separator({
  size = "md",
  showLine = false,
  lineColor = "#e5e7eb",
  ...props
}: SeparatorProps) {
  if (showLine) {
    return (
      <div css={[separatorStyles, spacingMap[size]]} {...props}>
        <hr
          css={[
            lineStyles,
            css`
              background-color: ${lineColor};
            `,
          ]}
        />
      </div>
    )
  }

  return <div css={[separatorStyles, spacingMap[size]]} {...props} />
}
