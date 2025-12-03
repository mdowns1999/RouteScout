/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Card, CardContent, Grid, useTheme } from "@mui/material";
import Heading from "../../../components/UI/Heading/Heading";
import Paragraph from "../../../components/UI/Paragraph/Paragraph";
import Separator from "../../../components/UI/Separator/Separator";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MapIcon from "@mui/icons-material/Map";

const getIconCircleCss = (theme) => css`
  text-align: center;
  background-color: ${theme.palette.mode === "dark" ? "#ffffff" : "#000000"};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  svg {
    color: ${theme.palette.mode === "dark" ? "#000000" : "#ffffff"};
  }
`;

const cardWrapper = css`
  padding: 10px;
  border-radius: 5px;
  min-width: 250px;
  min-height: 275px;
`;

export default function CardGrid() {
  const theme = useTheme();

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

  return (
    <Grid container spacing={8}>
      {cardContent.map((card) => (
        <Grid size={{ sm: 12, md: 4 }} key={card.title}>
          <Card
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#000000" : "#ffffff",
              color: (theme) =>
                theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            }}
          >
            <div css={cardWrapper}>
              <CardContent sx={{ height: "100%" }}>
                <div css={getIconCircleCss(theme)}>{card.icon}</div>
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
  );
}
