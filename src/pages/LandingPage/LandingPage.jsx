import HeroBanner from "../../components/HeroBanner/HeroBanner"
import { Box, Button } from "@mui/material"
import Heading from "../../components/UI/Heading/Heading"
import Paragraph from "../../components/UI/Paragraph/Paragraph"
import Separator from "../../components/UI/Separator/Separator"
import LayoutBand from "../../components/UI/Layoutband/LayoutBand"
import CardGrid from "./components/CardGrid"
import BenefitsRow from "./components/BenefitsRow"

export default function LandingPage() {
  return (
    <div>
      <HeroBanner />
      <LayoutBand spacing="lg">
        <Heading level="h2" size="h4" centered>
          How it Works
        </Heading>
        <Paragraph centered>
          Three simple steps to create your perfect adventure:
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
        <LayoutBand spacing="lg">
          <Heading level="h2" size="h4" centered>
            Why Choose RouteScout
          </Heading>
          <Paragraph centered>
            Three simple steps to create your perfect adventure:
          </Paragraph>
          <Separator size="xs" />
          <BenefitsRow />
        </LayoutBand>
      </Box>

      <LayoutBand spacing="lg">
        <Heading level="h2" size="h4" centered>
          Ready to Plan your Adventure?
        </Heading>
        <Paragraph centered>Begin your adventure by using RouteScout</Paragraph>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Button variant="contained" size="small">
            Start your Trip Now
          </Button>
        </Box>
      </LayoutBand>
    </div>
  )
}
