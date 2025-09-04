/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Link, NavLink } from "react-router-dom";
import Image from "../../components/UI/Image/Image";
import logo from "../../assets/react.svg";
import Row from "../../components/UI/Row/Row";
import { Container } from "@mui/material";


const navListCss = css`
  display: flex;
  gap: 1em;
`;

export default function Header() {
  return (
    <header>
      <Container maxWidth='xl'>
        <Row alignX="between" alignY="center">
          <Image to="/" src={logo} alt="Downs Portfolio Logo" />

          <nav>
            <ul css={navListCss}>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/trip">Plan Trip</NavLink>
            </ul>
          </nav>
        </Row>
      </Container>
    </header>
  );
}
