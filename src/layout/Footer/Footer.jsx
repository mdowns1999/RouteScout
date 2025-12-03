/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Container } from "@mui/material"
import Paragraph from "../../components/UI/Paragraph/Paragraph"

const footerCss = css`
  background-color: var(--primaryColor);
  color: white;
  padding: 30px 0;
`

export default function Footer() {
  const date = new Date().getFullYear()
  return (
    <footer css={footerCss}>
      <Container>
        <Paragraph centered>
          © {date} RouteScout. All rights reserved.
        </Paragraph>
      </Container>
    </footer>
  )
}
