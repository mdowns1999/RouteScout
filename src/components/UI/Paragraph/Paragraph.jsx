import { useTheme } from "@mui/material"
import Typography from "@mui/material/Typography"

function useParagraphFontSize(size = "md") {
  const theme = useTheme()

  const sizeMap = {
    lg: theme.typography.body1.fontSize,
    md: theme.typography.body2.fontSize,
    sm: theme.typography.caption.fontSize,
    xs: "0.75rem", // fallback or define in theme
  }

  return { fontSize: sizeMap[size] || theme.typography.body2.fontSize }
}

const Paragraph = ({ centered = false, children, size, ...props }) => {
  const fontSizeStyles = useParagraphFontSize(size)
  return (
    <Typography
      component="p"
      gutterBottom
      sx={fontSizeStyles}
      align={centered ? "center" : "left"}
      {...props}
    >
      {children}
    </Typography>
  )
}

export default Paragraph
