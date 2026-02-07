import Heading from "../../components/UI/Heading/Heading"
import Paragraph from "../../components/UI/Paragraph/Paragraph"
import LayoutBand from "../../components/UI/Layoutband/LayoutBand"

export default function DiscoverPage() {
  return (
    <LayoutBand spacing="md">
      <Heading level="h1" centered>
        Discover
      </Heading>
      <Paragraph centered>
        Discover amazing destinations and popular routes.
      </Paragraph>
    </LayoutBand>
  )
}
