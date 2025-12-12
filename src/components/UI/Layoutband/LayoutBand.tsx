import { Container } from "@mui/material"
import type { ContainerProps } from "@mui/material/Container"

const spacingMap = {
  none: 0,
  xs: "1rem",
  sm: "2rem",
  md: "4rem",
  lg: "6rem",
  xl: "8rem",
}

type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface LayoutBandProps extends Omit<ContainerProps, 'children'> {
  spacing?: Spacing
  children: React.ReactNode
}

export default function LayoutBand({
  spacing = "md",
  children,
  sx = {},
  ...props
}: LayoutBandProps) {
  const paddingY = spacingMap[spacing] || spacingMap.md

  return (
    <Container
      sx={{
        py: paddingY,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  )
}
