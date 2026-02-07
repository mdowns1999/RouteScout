import Heading from "../../components/UI/Heading/Heading"
import Paragraph from "../../components/UI/Paragraph/Paragraph"
import LayoutBand from "../../components/UI/Layoutband/LayoutBand"

export default function HelpPage() {
  return (
    <LayoutBand spacing="md">
      <Heading level="h1" centered>
        Help
      </Heading>
      <Paragraph centered>
        Find answers to common questions and get support.
      </Paragraph>
    </LayoutBand>
  )
}
