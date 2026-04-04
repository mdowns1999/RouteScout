import HeroBanner from "../../components/HeroBanner/HeroBanner"
import { Box, Button } from "@mui/material"
import Heading from "../../components/UI/Heading/Heading"
import Paragraph from "../../components/UI/Paragraph/Paragraph"
import Separator from "../../components/UI/Separator/Separator"
import LayoutBand from "../../components/UI/Layoutband/LayoutBand"
import CardGrid from "./components/CardGrid"
import FeatureGrid from "./components/FeatureGrid"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      <HeroBanner />
      <LayoutBand spacing="md">
        <Heading level="h2" centered bold>
          How it Works
        </Heading>
        <Paragraph centered>
          Three simple steps to create your perfect road trip adventure
        </Paragraph>
        <Separator />
        <CardGrid />
      </LayoutBand>

      <Box
        component="section"
        sx={{
          backgroundColor: "background.paper",
        }}
      >
        <LayoutBand spacing="md">
          <Heading level="h2" size="h4" centered bold>
            Why Choose RouteScout?
          </Heading>
          <Paragraph centered>
            Everything you need to plan and execute the perfect road trip
          </Paragraph>
          <Separator size="xs" />
          <FeatureGrid />
        </LayoutBand>
      </Box>

      <LayoutBand spacing="md">
        <Heading level="h2" size="h4" centered>
          Ready to Plan Your Adventure?
        </Heading>
        <Paragraph centered>
          Ready to find the best stops between here and there?
        </Paragraph>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => navigate("/trip")}
          >
            Start Your Trip Now
          </Button>
        </Box>
      </LayoutBand>
    </div>
  )
}
