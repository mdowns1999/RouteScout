import { useState } from "react"
import { CardMedia, Card, CardContent, Box, Stack } from "@mui/material"
import Checkbox from '@mui/material/Checkbox'
import RouteIcon from '@mui/icons-material/Route'
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import testImg from '../../assets/images/test.png'

// Extract style objects
const cardStyles = {
  display: 'flex', 
  alignItems: 'center', 
  margin: 2
}

const mediaStyles = {
  maxWidth: 300, 
  maxHeight: 400,
  objectFit: 'cover' as const // Prevents image distortion
}

const contentWrapperStyles = {
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center'
}

export default function SuggestedStops() {
  const [checked, setChecked] = useState(false)
  
  return (
<>
<Card>
  <Stack direction="row" spacing={2} alignItems="center">
    <RouteIcon />
    <Heading level="h1" size="h4">
    Your Route
  </Heading>
  </Stack>
</Card>
    <Card sx={cardStyles}>
      <CardMedia
        component="img"
        sx={mediaStyles}
        image={testImg}
        alt="Description"
      />
      <CardContent sx={{ flex: 1 }}>
        <Box sx={contentWrapperStyles}>
          <Box>
            <Heading level="h2" size="h5">Amazing Stop</Heading>
            <Paragraph size="sm">
              A brief description of this amazing stop along your route.
            </Paragraph>
          </Box>
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        </Box>
      </CardContent>
    </Card>
</>
  )
}