/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Heading from "../UI/Heading/Heading";
import Paragraph from "../UI/Paragraph/Paragraph";
import { Container } from "@mui/material";

const heroCSS = css`
  background: url("https://images.unsplash.com/photo-1755150209904-2b1ebc0c4b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VuaWMlMjByb2FkJTIwdHJpcCUyMGhpZ2h3YXklMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU2MTM3NDY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral")
    no-repeat center center;
  background-size: cover;
  width: 100%;
  min-height: 80vh;
  display: flex;
  align-items: center;
  position: relative;

  /* Dark overlay for better text readability */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }

  /* Ensure content is above overlay */
  > * {
    position: relative;
    z-index: 2;
  }
`;

const heroContentCSS = css`
  color: white;
`;

export default function HeroBanner() {
  return (
    <section css={heroCSS}>
      <Container>
        <div css={heroContentCSS}>
          <Heading size="h2" centered>
            Plan your Perfect Trip
          </Heading>
          <Paragraph centered>
            Discover amazing destinations and create unforgettable memories
          </Paragraph>
        </div>
      </Container>
    </section>
  );
}
