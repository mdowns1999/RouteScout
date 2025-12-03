import { Container } from "@mui/material"

const spacingMap = {
  none: 0,
  xs: "1rem",
  sm: "2rem",
  md: "4rem",
  lg: "6rem",
  xl: "8rem",
}

export default function LayoutBand({
  spacing = "md",
  children,
  sx = {},
  ...props
}) {
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
