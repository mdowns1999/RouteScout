/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Container, useTheme } from "@mui/material"
import Paragraph from "../../components/UI/Paragraph/Paragraph"

const getFooterCss = (bgColor: string) => css`
  background-color: ${bgColor};
  color: white;
  padding: 30px 0;
`

export default function Footer() {
  const theme = useTheme()
  const date = new Date().getFullYear()
  // Use darker shade in dark mode to match AppBar
  const footerColor = theme.palette.mode === 'dark'
    ? theme.palette.primary.dark
    : theme.palette.primary.main
  return (
    <footer css={getFooterCss(footerColor)}>
      <Container>
        <Paragraph centered>
          © {date} RouteScout. All rights reserved.
        </Paragraph>
      </Container>
    </footer>
  )
}
