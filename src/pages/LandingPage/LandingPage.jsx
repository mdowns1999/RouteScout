import { css } from "@emotion/react";
import Row from "../../components/UI/Row/Row";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import { Container } from "@mui/material";


const testBox = css`
  background-color: lightblue;
  padding: 10px;
  border-radius: 5px;
`;

export default function LandingPage() {
  return (
    <div>
      <HeroBanner />
      <Container>
        <h1>Welcome to Route Scout</h1>
        <p>Your journey begins here.</p>
        <div
          style={{
            backgroundColor: "lightgray",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <Row gutters="xl">
            <div>This is a test box 1.</div>
            <div>This is a test box 2.</div>
            <div>This is a test box 3.</div>
          </Row>
        </div>
      </Container>
    </div>
  );
}
