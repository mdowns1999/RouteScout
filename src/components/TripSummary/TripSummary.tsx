import {
  CardMedia,
  Card,
  CardContent,
  Box,
  Stack,
  Grid,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Rating,
} from "@mui/material"
import RouteIcon from "@mui/icons-material/Route"
import PlaceIcon from "@mui/icons-material/Place"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import DeleteIcon from "@mui/icons-material/Delete"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import LayoutBand from "../UI/Layoutband/LayoutBand"
import Map from "../Map/Map"
import testImg from "../../assets/images/test.png"

// Extract style objects
const mediaStyles = {
  maxWidth: 100,
  maxHeight: 200,
  objectFit: "cover" as const, // Prevents image distortion
}

export default function TripSummary() {
  return (
    <LayoutBand>
      <Heading level="h1" size="h3" centered>
        Your Trip Summary
      </Heading>
      <Paragraph centered>
        Review your trip route and stops. Hover over map pins for details, or
        use the sidebar to manage your stops.
      </Paragraph>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Chip label="3 Stops Selected" color="primary" />
      </Box>

      <Grid container spacing={2}>
        {/* Left Column - Trip Overview and Route Stops */}
        <Grid size={5}>
          <Stack spacing={2}>
            {/* Trip Overview Card */}
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <RouteIcon />
                  <Heading level="h2" size="h4">
                    Trip Overview
                  </Heading>
                </Stack>
                <Stack spacing={1}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Paragraph size="sm">Stops:</Paragraph>
                    <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                      3
                    </Paragraph>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Paragraph size="sm">Total Distance:</Paragraph>
                    <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                      145 miles
                    </Paragraph>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Paragraph size="sm">Estimated Drive Time:</Paragraph>
                    <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                      3h 20m
                    </Paragraph>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Route Stops Card */}
            <Card>
              <CardContent>
                <Heading level="h2" size="h5" sx={{ mb: 2 }}>
                  Route Stops
                </Heading>

                {/* Route Flow */}
                <Stack spacing={2}>
                  {/* Start Location */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PlaceIcon color="primary" />
                    <Box>
                      <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                        Start: San Francisco, CA
                      </Paragraph>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Stop 1 */}
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      p: 2,
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                    >
                      1
                    </Avatar>
                    <CardMedia
                      component="img"
                      sx={mediaStyles}
                      image={testImg}
                      alt="Local Artisan Market"
                    />
                    <Box sx={{ flex: 1 }}>
                      <Paragraph size="sm" sx={{ fontWeight: "bold", mb: 0.5 }}>
                        Local Artisan Market
                      </Paragraph>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Rating
                          value={4.5}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                        <Paragraph size="xs">(124 reviews)</Paragraph>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                        <Chip label="Shopping" size="small" />
                        <Chip label="Local" size="small" />
                      </Box>
                      <Paragraph size="xs">
                        45 miles • 1h 10m from start
                      </Paragraph>
                    </Box>
                    <Box>
                      <IconButton size="small" aria-label="open">
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>

                  <Divider />

                  {/* Stop 2 */}
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      p: 2,
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                    >
                      2
                    </Avatar>
                    <CardMedia
                      component="img"
                      sx={mediaStyles}
                      image={testImg}
                      alt="Historic Lighthouse"
                    />
                    <Box sx={{ flex: 1 }}>
                      <Paragraph size="sm" sx={{ fontWeight: "bold", mb: 0.5 }}>
                        Historic Lighthouse
                      </Paragraph>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Rating
                          value={4.8}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Paragraph size="xs">(89 reviews)</Paragraph>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                        <Chip label="Landmark" size="small" />
                        <Chip label="Photo Op" size="small" />
                      </Box>
                      <Paragraph size="xs">
                        30 miles • 45m from previous stop
                      </Paragraph>
                    </Box>
                    <Box>
                      <IconButton size="small" aria-label="open">
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>

                  <Divider />

                  {/* Stop 3 */}
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      p: 2,
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                    >
                      3
                    </Avatar>
                    <CardMedia
                      component="img"
                      sx={mediaStyles}
                      image={testImg}
                      alt="Scenic Overlook"
                    />
                    <Box sx={{ flex: 1 }}>
                      <Paragraph size="sm" sx={{ fontWeight: "bold", mb: 0.5 }}>
                        Scenic Overlook
                      </Paragraph>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Rating
                          value={4.3}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Paragraph size="xs">(203 reviews)</Paragraph>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                        <Chip label="Nature" size="small" />
                        <Chip label="Views" size="small" />
                      </Box>
                      <Paragraph size="xs">
                        25 miles • 35m from previous stop
                      </Paragraph>
                    </Box>
                    <Box>
                      <IconButton size="small" aria-label="open">
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>

                  <Divider />

                  {/* Destination */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PlaceIcon color="error" />
                    <Box>
                      <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                        Destination: Los Angeles, CA
                      </Paragraph>
                      <Paragraph size="xs">45 miles • 50m</Paragraph>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column - Map */}
        <Grid size={7}>
          <Box
            sx={{
              height: "600px",
              width: "100%",
              border: "1px solid #ddd",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Map height="600px" />
          </Box>
        </Grid>
      </Grid>
    </LayoutBand>
  )
}
