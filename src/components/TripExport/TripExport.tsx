import {
  Card,
  CardContent,
  Box,
  Stack,
  Grid,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import DownloadIcon from "@mui/icons-material/Download"
import ShareIcon from "@mui/icons-material/Share"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import PlaceIcon from "@mui/icons-material/Place"
import RouteIcon from "@mui/icons-material/Route"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import LayoutBand from "../UI/Layoutband/LayoutBand"
import testImg from "../../assets/images/test.png"
import { useState } from "react"
import Separator from "../UI/Separator/Separator"

export default function TripExport() {
  const navigate = useNavigate()
  const [selectedMap, setSelectedMap] = useState("google")
  const shareableLink = "https://triptrekker.app/trip/8kx980p"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
    // Could add a toast notification here
  }

  return (
    <LayoutBand>
<<<<<<< Updated upstream
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Box
          sx={{
            bgcolor: "secondary.main",
            borderRadius: "50%",
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RouteIcon sx={{ fontSize: 50, color: "white" }} />
=======
      <Box sx={{ maxWidth: 800, mx: "auto" }}>

        {/* Success header */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              bgcolor: "secondary.main",
              borderRadius: "50%",
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 42, color: "white" }} />
          </Box>
          <Heading level="h1" size="h4" centered>Your Trip is Ready!</Heading>
          <Paragraph size="sm" centered>
            Export to your navigation app, download for GPS, or share with friends.
          </Paragraph>
>>>>>>> Stashed changes
        </Box>
      </Box>
      <Heading level="h1" size="h3" centered>
        Your Trip is Ready!
      </Heading>
      <Paragraph centered>
        Your road trip has been planned successfully. Export it to your favorite
        navigation app or share it with friends.
      </Paragraph>
      <Separator />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Left Column - Export Options */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Export to Maps Card */}
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <OpenInNewIcon color="primary" />
                  <Heading level="h2" size="h5">
                    Export to Maps
                  </Heading>
                </Stack>

                <RadioGroup
                  value={selectedMap}
                  onChange={(e) => setSelectedMap(e.target.value)}
                >
                  <FormControlLabel
                    value="google"
                    control={<Radio />}
                    label="Google Maps"
                  />
                  <FormControlLabel
                    value="apple"
                    control={<Radio />}
                    label="Apple Maps"
                  />
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Download Card */}
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <DownloadIcon color="primary" />
                  <Heading level="h2" size="h5">
                    Download
                  </Heading>
                </Stack>

                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Export Data (JSON)
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Share Trip Card */}
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <ShareIcon color="primary" />
                  <Heading level="h2" size="h5">
                    Share Trip
                  </Heading>
                </Stack>

                <Paragraph size="sm" sx={{ mb: 1 }}>
                  Shareable Link
                </Paragraph>
                <TextField
                  fullWidth
                  value={shareableLink}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCopyLink} edge="end">
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Paragraph size="xs" sx={{ mt: 1, color: "text.secondary" }}>
                  Share this link with friends and family to let them view your
                  trip plan.
                </Paragraph>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                onClick={() => navigate("/trip")}
              >
                Plan New Trip
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate("/trip")}
              >
                Edit This Trip
              </Button>
            </Stack>
          </Stack>
        </Grid>

        {/* Right Column - Trip Summary */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Trip Summary Stats */}
            <Card>
              <CardContent>
                <Heading level="h2" size="h5" sx={{ mb: 3 }}>
                  Trip Summary
                </Heading>

                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <PlaceIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Heading level="h3" size="h3" sx={{ mb: 0 }}>
                        1
                      </Heading>
                      <Paragraph size="sm">Stops</Paragraph>
                    </Box>
                  </Grid>
                  <Grid size={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <RouteIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Heading level="h3" size="h3" sx={{ mb: 0 }}>
                        250
                      </Heading>
                      <Paragraph size="sm">Miles</Paragraph>
                    </Box>
                  </Grid>
                  <Grid size={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <AccessTimeIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Heading level="h3" size="h3" sx={{ mb: 0 }}>
                        6h
                      </Heading>
                      <Paragraph size="sm">Drive Time</Paragraph>
                    </Box>
                  </Grid>
                </Grid>

                <Stack spacing={1} sx={{ mt: 3 }}>
                  <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                    From:
                  </Paragraph>
                  <Paragraph size="sm">d</Paragraph>

                  <Paragraph size="sm" sx={{ fontWeight: "bold", mt: 2 }}>
                    To:
                  </Paragraph>
                  <Paragraph size="sm">s</Paragraph>
                </Stack>
              </CardContent>
            </Card>

            {/* Your Stops */}
            <Card>
              <CardContent>
                <Heading level="h2" size="h5" sx={{ mb: 2 }}>
                  Your Stops
                </Heading>

                <Stack spacing={2}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Avatar sx={{ bgcolor: "primary.main" }}>1</Avatar>
                        <img
                          src={testImg}
                          alt="Local Artisan Market"
                          style={{
                            width: 64,
                            height: 64,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Paragraph
                            size="sm"
                            sx={{ fontWeight: "bold", mb: 0.5 }}
                          >
                            Local Artisan Market
                          </Paragraph>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Paragraph size="xs" sx={{ color: "warning.main" }}>
                              ⭐ 4.4
                            </Paragraph>
                            <Paragraph
                              size="xs"
                              sx={{ color: "text.secondary" }}
                            >
                              📍 Market Square
                            </Paragraph>
                          </Box>
                          <Box sx={{ mt: 0.5 }}>
                            <Box
                              component="span"
                              sx={{
                                bgcolor: "primary.main",
                                color: "white",
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                fontSize: "0.75rem",
                              }}
                            >
                              shopping
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </LayoutBand>
  )
}
