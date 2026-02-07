import Heading from "../../components/UI/Heading/Heading"
import Paragraph from "../../components/UI/Paragraph/Paragraph"
import LayoutBand from "../../components/UI/Layoutband/LayoutBand"

export default function MyTripsPage() {
  return (
    <LayoutBand spacing="md">
      <Heading level="h1" centered>
        My Trips
      </Heading>
      <Paragraph centered>Your saved trips will appear here.</Paragraph>
    </LayoutBand>
  )
}
