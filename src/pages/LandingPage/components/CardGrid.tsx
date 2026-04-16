/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Card, CardContent, Grid, Typography, useTheme, type Theme } from "@mui/material"
import Heading from "../../../components/UI/Heading/Heading"
import Paragraph from "../../../components/UI/Paragraph/Paragraph"
import Separator from "../../../components/UI/Separator/Separator"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import MapIcon from "@mui/icons-material/Map"
import ExploreIcon from "@mui/icons-material/Explore"

const getIconCircleCss = (theme: Theme) => css`
  text-align: center;
  background-color: ${theme.palette.accent.vintage};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  svg {
    color: #ffffff;
  }
`

const cardWrapper = css`
  padding: 10px;
  border-radius: 5px;
  min-width: 250px;
  height: 100%;
  box-sizing: border-box;
`

export default function CardGrid() {
  const theme = useTheme()

  const cardContent = [
    {
      icon: <LocationOnIcon fontSize="large" />,
      title: "Set Your Route",
      description:
        "Enter start and end locations, set your budget, and choose how to prioritize stops",
    },
    {
      icon: <StarBorderIcon fontSize="large" />,
      title: "Choose Your Interests",
      description:
        "Pick from 10 categories — food, nature, history, hidden gems, and more",
    },
    {
      icon: <MapIcon fontSize="large" />,
      title: "Pick Your Stops",
      description:
        "Browse stops from Google Places on an interactive map and select the ones you want",
    },
    {
      icon: <ExploreIcon fontSize="large" />,
      title: "Review & Export",
      description:
        "Drag-and-drop to reorder stops, then send to Google Maps, Apple Maps, or save as GPX",
    },
  ]

  return (
    <Grid container spacing={3}>
      {cardContent.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title} sx={{ display: "flex" }}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#000000" : "#ffffff",
              color: (theme) =>
                theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            }}
          >
            <div css={cardWrapper}>
              <CardContent sx={{ height: "100%" }}>
                <Typography
                  variant="overline"
                  display="block"
                  align="center"
                  sx={{ color: "text.secondary", lineHeight: 1, mb: 1 }}
                >
                  Step {index + 1}
                </Typography>
                <div css={getIconCircleCss(theme)}>{card.icon}</div>
                <Separator size="xs" />
                <Heading level="h3" size="h4" centered>
                  {card.title}
                </Heading>
                <Paragraph centered size="sm">{card.description}</Paragraph>
              </CardContent>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
