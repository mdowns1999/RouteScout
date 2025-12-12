import { useTheme } from "@mui/material"
import Typography from "@mui/material/Typography"

type ParagraphSize = 'xs' | 'sm' | 'md' | 'lg'

function useParagraphFontSize(size: ParagraphSize = "md") {
  const theme = useTheme()

  const sizeMap: Record<ParagraphSize, string | number | undefined> = {
    lg: theme.typography.h6.fontSize,     
    md: theme.typography.body1.fontSize,   
    sm: theme.typography.body2.fontSize,   
    xs: theme.typography.caption.fontSize, 
  }

  return { fontSize: sizeMap[size] || theme.typography.body1.fontSize }
}

interface ParagraphProps {
  centered?: boolean
  children: React.ReactNode
  size?: ParagraphSize
  [key: string]: unknown
}

const Paragraph: React.FC<ParagraphProps> = ({ centered = false, children, size = 'md', ...props }) => {
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
