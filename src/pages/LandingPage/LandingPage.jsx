/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import { Card, CardContent, Container, Grid } from "@mui/material";
import Heading from "../../components/UI/Heading/Heading";
import Paragraph from "../../components/UI/Paragraph/Paragraph";
import Separator from "../../components/UI/Separator/Separator";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MapIcon from "@mui/icons-material/Map";

const cardWrapper = css`
  padding: 10px;
  border-radius: 5px;
  min-width: 250px;
  min-height: 275px;
`;

const cardContent = [
  {
    icon: <LocationOnIcon fontSize="large" />,
    title: "Set Your Route",
    description:
      "Enter your starting point and destination, plus any travel preferences",
  },
  {
    icon: <StarBorderIcon fontSize="large" />,
    title: "Choose Your Activities",
    description:
      "Select from categories like food, nature, history, and attractions",
  },
  {
    icon: <MapIcon fontSize="large" />,
    title: "Get Your Trip",
    description:
      "Review smart suggestions and export your trip to Google or Apple Maps",
  },
];
export default function LandingPage() {
  return (
    <div>
      <HeroBanner />
      <Separator />
      <Container>
        <Heading level="h2" size="h4" centered>
          How it Works
        </Heading>
        <Paragraph centered>
          Three simple steps to create your perfect adventure:
        </Paragraph>
        <Separator />

        <Grid container spacing={3}>
          {cardContent.map((card) => (
            <Grid size={4}>
              <Card key={card.title}>
                <div css={cardWrapper}>
                  <CardContent sx={{ height: "100%" }}>
                    <div style={{ textAlign: "center" }}>{card.icon}</div>
                    <Separator size="xs" />
                    <Heading level="h3" size="h6" centered>
                      {card.title}
                    </Heading>
                    <Paragraph centered>{card.description}</Paragraph>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Separator />
      </Container>
    </div>
  );
}
