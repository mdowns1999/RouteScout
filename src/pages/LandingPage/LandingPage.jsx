/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import { Box, Button, Container } from "@mui/material";
import Heading from "../../components/UI/Heading/Heading";
import Paragraph from "../../components/UI/Paragraph/Paragraph";
import Separator from "../../components/UI/Separator/Separator";
import CardGrid from "./components/CardGrid";
import BenefitsRow from "./components/BenefitsRow";

const whyChooseBoxCss = css`
  background-color: #f0f0f0;
`;

export default function LandingPage() {
  return (
    <div>
      <HeroBanner />
      <Container sx={{ padding: "20px" }}>
        <Heading level="h2" size="h4" centered>
          How it Works
        </Heading>
        <Paragraph centered>
          Three simple steps to create your perfect adventure:
        </Paragraph>
        <Separator />
        <CardGrid />
      </Container>

      <section css={whyChooseBoxCss}>
        <Container sx={{ padding: "20px" }}>
          <Heading level="h2" size="h4" centered>
            Why Choose RouteScout
          </Heading>
          <Paragraph centered>
            Three simple steps to create your perfect adventure:
          </Paragraph>
          <Separator size="xs" />
          <BenefitsRow />
        </Container>
      </section>

      <Container sx={{ padding: "20px" }}>
        <div>
          <Heading level="h2" size="h4" centered>
            Ready to Plan your Adventure?
          </Heading>
          <Paragraph centered>
            Begin your adventure by using RouteScout
          </Paragraph>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Button variant="contained" size="small">
              Start your Trip Now
            </Button>
          </Box>
        </div>
      </Container>
    </div>
  );
}
