import { useTheme } from "@mui/material"
import Typography from "@mui/material/Typography"

function useParagraphFontSize(size = "md") {
  const theme = useTheme()

  const sizeMap = {
    lg: theme.typography.h6.fontSize,     
    md: theme.typography.body1.fontSize,   
    sm: theme.typography.body2.fontSize,   
    xs: theme.typography.caption.fontSize, 
  }

  return { fontSize: sizeMap[size] || theme.typography.body1.fontSize }
}

const Paragraph = ({ centered = false, children, size = 'md', ...props }) => {
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
