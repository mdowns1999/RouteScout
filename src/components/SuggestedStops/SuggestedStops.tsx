import { useState } from "react"
import {
  CardMedia,
  Card,
  CardContent,
  Box,
  Stack,
  Grid,
  Divider,
  Container,
  Chip,
} from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import RouteIcon from "@mui/icons-material/Route"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import testImg from "../../assets/images/test.png"
import Separator from "../UI/Separator/Separator"

// Extract style objects
const mediaStyles = {
  maxWidth: 100,
  maxHeight: 200,
  objectFit: "cover" as const, // Prevents image distortion
}

export default function SuggestedStops() {
  const [checked, setChecked] = useState(false)

  return (
    <>
      <Container>
        <Separator />
        <Heading level="h1" size="h3" centered>
          Suggested Stops Along Your Route
        </Heading>
        <Paragraph centered>
          Explore stops along your route and select the ones you'd like to
          visit. Hover over map pins for details.
        </Paragraph>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Chip label="0 Stops Selected" color="primary" />
        </div>
        <Separator />
      </Container>

      <Grid container spacing={2}>
        {/* Left Column - Route info and available stops */}
        <Grid size={5}>
          <Stack spacing={2}>
            {/* Your Route Card */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <RouteIcon />
                  <Heading level="h1" size="h4">
                    Your Route
                  </Heading>
                </Stack>
                <div>
                  <Paragraph size="sm">To:</Paragraph>
                  <Paragraph size="sm">From:</Paragraph>
                  <Divider />
                  <Paragraph size="sm">
                    2 Stops available along your route
                  </Paragraph>
                </div>
              </CardContent>
            </Card>

            {/* Available Stops Card */}
            <Card>
              <CardContent>
                <Heading level="h2" size="h5" sx={{ mb: 2 }}>
                  Available Stops
                </Heading>

                {/* Individual Stop Card */}
                <Card sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  <CardMedia
                    component="img"
                    sx={mediaStyles}
                    image={testImg}
                    alt="Local Artisan Market"
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Heading level="h3" size="h6">
                      Local Artisan Market
                    </Heading>
                    <Paragraph size="sm">
                      Weekly market featuring local crafts, food, and live
                      music.
                    </Paragraph>
                  </CardContent>
                </Card>

                {/* You can add more stop cards here */}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column - Map */}
        <Grid size={7}>
          <Box
            sx={{
              height: "100%",
              border: "1px solid #ddd",
              borderRadius: 1,
              p: 2,
            }}
          >
            <p>MAP HERE</p>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
