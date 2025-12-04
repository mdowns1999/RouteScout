import { Card, Stack } from "@mui/material"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"

export default function LocationsView() {
  return (
    <div>
      <Heading size='h2' centered>
        Plan your Roadtrip
      </Heading>
      <Paragraph centered>
        Let's start by setting your starting point and destination. We'll help you discover amazing stops along the way.
      </Paragraph>

      <Stack direction="row">
        <Card>
            1
        </Card>
        <Card>
            2
        </Card>
        </Stack>
    </div>
  )
}