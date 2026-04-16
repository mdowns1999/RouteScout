import {
  Card,
  CardContent,
  Box,
  Stack,
  Grid,
  Button,
  Avatar,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  Rating,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useTripPlan, type Place } from "../../contexts/TripPlanContext"
import MapIcon from "@mui/icons-material/Map"
import DownloadIcon from "@mui/icons-material/Download"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import PlaceIcon from "@mui/icons-material/Place"
import RouteIcon from "@mui/icons-material/Route"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import LayoutBand from "../UI/Layoutband/LayoutBand"
import { useState } from "react"

function StopCard({ stop, index }: { stop: Place; index: number }) {
  return (
    <Card>
      <CardContent sx={{ py: "12px !important" }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 28, height: 28, fontSize: 13, flexShrink: 0 }}>
            {index}
          </Avatar>
          {stop.photoUrl && (
            <Box
              component="img"
              src={stop.photoUrl}
              alt={stop.name}
              sx={{
                width: 56,
                height: 56,
                objectFit: "cover",
                borderRadius: 2,
                flexShrink: 0,
                display: { xs: "none", md: "block" },
              }}
            />
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0.25 }}>
              {stop.name}
            </Paragraph>
            {stop.rating > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
                <Rating value={stop.rating} precision={0.1} size="small" readOnly />
                <Paragraph size="xs">({stop.totalRatings})</Paragraph>
              </Box>
            )}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {stop.types.slice(0, 2).map((t) => (
                <Chip key={t} label={t.replace(/_/g, " ")} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function TripExport() {
  const navigate = useNavigate()
  const { state, resetTrip } = useTripPlan()
  const [snackbarMsg, setSnackbarMsg] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const showSnackbar = (msg: string) => {
    setSnackbarMsg(msg)
    setSnackbarOpen(true)
  }

  const enc = encodeURIComponent

  const handleOpenGoogleMaps = () => {
    const waypoints = state.selectedStops
      .map((s) => `${s.latLng.lat},${s.latLng.lng}`)
      .join("|")
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${enc(state.startLocation)}` +
      `&destination=${enc(state.endLocation)}` +
      (waypoints ? `&waypoints=${enc(waypoints)}` : "") +
      `&travelmode=driving`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleOpenAppleMaps = () => {
    const url =
      `https://maps.apple.com/?saddr=${enc(state.startLocation)}` +
      `&daddr=${enc(state.endLocation)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleExportGPX = () => {
    const tripName = `${state.startLocation} to ${state.endLocation}`
    const waypoints = state.selectedStops
      .map(
        (s) =>
          `    <rtept lat="${s.latLng.lat}" lon="${s.latLng.lng}">\n` +
          `      <name>${s.name}</name>\n` +
          `      <desc>${s.address}</desc>\n` +
          `    </rtept>`
      )
      .join("\n")
    const gpx =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<gpx version="1.1" creator="RouteScout">\n` +
      `  <metadata><name>${tripName}</name></metadata>\n` +
      `  <rte>\n` +
      `    <name>${tripName}</name>\n` +
      waypoints + "\n" +
      `  </rte>\n` +
      `</gpx>`
    const blob = new Blob([gpx], { type: "application/gpx+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "routescout-trip.gpx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showSnackbar("GPX file downloaded — open it in your GPS app")
  }

  const handleCopyLink = () => {
    if (!state.tripId) {
      showSnackbar("Share link unavailable — trip could not be saved. Try planning again.")
      return
    }
    const shareUrl = `https://mdowns1999.github.io/RouteScout/trip/share/${state.tripId}`
    navigator.clipboard.writeText(shareUrl)
    showSnackbar("Link copied to clipboard!")
  }

  return (
    <LayoutBand>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>

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
        </Box>

        {/* Stats card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
              sx={{ justifyContent: "space-around", mb: 2 }}
            >
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <PlaceIcon sx={{ color: "primary.main", mb: 0.5 }} />
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {state.selectedStops.length}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Stops</Paragraph>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <RouteIcon sx={{ color: "primary.main", mb: 0.5 }} />
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {state.totalDistanceMiles > 0 ? state.totalDistanceMiles : "—"}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Miles</Paragraph>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <AccessTimeIcon sx={{ color: "primary.main", mb: 0.5 }} />
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {state.totalDriveTime || "—"}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Drive Time</Paragraph>
              </Box>
            </Stack>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: { xs: 0.5, sm: 0.75 }, justifyContent: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PlaceIcon sx={{ fontSize: 14, color: "secondary.main", flexShrink: 0 }} />
                <Paragraph size="sm" sx={{ fontWeight: 600, textAlign: "center" }}>{state.startLocation}</Paragraph>
              </Box>
              <Paragraph size="sm" sx={{ color: "text.disabled" }}>→</Paragraph>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Paragraph size="sm" sx={{ fontWeight: 600, textAlign: "center" }}>{state.endLocation}</Paragraph>
                <PlaceIcon sx={{ fontSize: 14, color: "error.main", flexShrink: 0 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Open in Maps */}
        <Heading level="h2" size="h6" sx={{ mb: 1.5 }}>Open in Maps</Heading>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<MapIcon />}
              onClick={handleOpenGoogleMaps}
            >
              Google Maps
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Tooltip
              title="Apple Maps doesn't support multiple waypoints — only start and end will be used"
              placement="top"
            >
              <span style={{ display: "block" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<MapIcon />}
                  onClick={handleOpenAppleMaps}
                >
                  Apple Maps
                </Button>
              </span>
            </Tooltip>
          </Grid>
        </Grid>

        {/* Secondary actions */}
        <Heading level="h2" size="h6" sx={{ mb: 1.5 }}>Save & Share</Heading>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<DownloadIcon />}
              onClick={handleExportGPX}
            >
              Export GPX File
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyLink}
            >
              Copy Share Link
            </Button>
          </Grid>
        </Grid>

        {/* Stop list */}
        {state.selectedStops.length > 0 && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Heading level="h2" size="h6" sx={{ mb: 1.5 }}>Your Stops</Heading>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {state.selectedStops.map((stop, i) => (
                <StopCard key={stop.id} stop={stop} index={i + 1} />
              ))}
            </Stack>
          </>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Navigation */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Edit This Trip
          </Button>
          <Button variant="contained" color="secondary" size="large" onClick={() => { resetTrip(); navigate("/trip") }}>
            Plan New Trip
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </LayoutBand>
  )
}
