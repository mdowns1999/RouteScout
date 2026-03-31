import { Container } from "@mui/material"
import type { ContainerProps } from "@mui/material/Container"

const spacingMap = {
  none: 0,
  nano: "0.25rem",
  xxs: "0.5rem",
  xs: "1rem",
  sm: "2rem",
  md: "4rem",
  lg: "6rem",
  xl: "8rem",
}

type Spacing = "none" | "nano" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
type SpacingDirection = "vertical" | "horizontal" | "all";

interface LayoutBandProps extends Omit<ContainerProps, "children"> {
  spacing?: Spacing;
  spacingDirection?: SpacingDirection;
  children: React.ReactNode;
}

export default function LayoutBand({
  spacing = "sm",
  spacingDirection = "vertical",
  children,
  sx = {},
  ...props
}: LayoutBandProps) {
  const paddingValue = spacingMap[spacing] || spacingMap.md

  const paddingStyles = {
    ...(spacingDirection === "vertical" || spacingDirection === "all" ? {
      paddingTop: paddingValue,
      paddingBottom: paddingValue,
    } : {}),
    ...(spacingDirection === "horizontal" || spacingDirection === "all" ? {
      paddingLeft: paddingValue,
      paddingRight: paddingValue,
    } : {}),
  }

  return (
    <Container
      sx={{
        ...paddingStyles,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  )
}
