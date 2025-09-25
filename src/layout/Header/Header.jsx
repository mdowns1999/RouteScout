/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Link, NavLink } from "react-router-dom";
import Image from "../../components/UI/Image/Image";
import logo from "../../assets/react.svg";
import Row from "../../components/UI/Row/Row";
import { Container } from "@mui/material";
import MobileMenu from "../../components/Menu/Menu";
import useIsMobile from "../../hooks/useIsMobile";

const navListCss = css`
  display: flex;
  gap: 1em;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const headerLayout = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding:20px;
`;


export default function Header() {
  const isMobile = useIsMobile();

  return (
    <header>
      <Container maxWidth="xl">
        <div css={headerLayout}>
          <Row alignY="middle">
            <Image to="/" src={logo} alt="Downs Portfolio Logo" />

            {!isMobile && (
              <nav>
                <ul css={navListCss}>
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/trip">Plan Trip</NavLink>
                </ul>
              </nav>
            )}
          </Row>
          {isMobile && <MobileMenu />}
        </div>
      </Container>
    </header>
  );
}
