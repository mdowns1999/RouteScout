/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Grid, Box, useTheme , type Theme} from "@mui/material"
import Heading from "../../../components/UI/Heading/Heading"
import Paragraph from "../../../components/UI/Paragraph/Paragraph"
import StarIcon from "@mui/icons-material/Star"
import ExploreIcon from "@mui/icons-material/Explore"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import ShareIcon from "@mui/icons-material/Share"
import TuneIcon from "@mui/icons-material/Tune"
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"

const getIconCircleCss = (theme: Theme, color: string) => css`
  background-color: ${color};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  svg {
    color: #ffffff;
    font-size: 30px;
  }
`

const featureBoxCss = css`
  text-align: center;
  padding: 2rem 1rem;
`

export default function FeatureGrid() {
  const theme = useTheme()

  const features = [
    {
      icon: <StarIcon />,
      title: "Smart Stop Suggestions",
      description: "AI-powered recommendations based on your interests and route",
      color: theme.palette.warning.main, // Golden Sun
    },
    {
      icon: <ExploreIcon />,
      title: "Interactive Map",
      description: "Visualize your route with pins for each suggested stop",
      color: theme.palette.primary.main, // Ocean Blue
    },
    {
      icon: <FileDownloadIcon />,
      title: "Export to Navigation Apps",
      description:
        "Seamlessly export to Google Maps, Apple Maps, or download as PDF",
      color: theme.palette.secondary.main, // Palm Green
    },
    {
      icon: <ShareIcon />,
      title: "Easy Sharing",
      description: "Share your trip with friends and family with a simple link",
      color: theme.palette.accent.vintage, // Vintage Luggage Brown
    },
    {
      icon: <TuneIcon />,
      title: "Flexible Planning",
      description:
        "Reorder stops, add custom locations, and adjust your itinerary",
      color: theme.palette.error.main, // Adventure Red
    },
    {
      icon: <CloudDownloadIcon />,
      title: "Offline Access",
      description:
        "Download your trip details for offline access during your journey",
      color: theme.palette.secondary.dark, // Darker Palm Green
    },
  ]

  return (
    <Grid container spacing={4}>
      {features.map((feature) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
          <Box css={featureBoxCss}>
            <div css={getIconCircleCss(theme, feature.color)}>{feature.icon}</div>
            <Heading level="h3" size="h5">
              {feature.title}
            </Heading>
            <Paragraph size="sm">{feature.description}</Paragraph>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
