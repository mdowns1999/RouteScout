import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Stack,
  Divider,
  Grid,
  Button,
  Avatar,
  Chip,
  Rating,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import MapIcon from "@mui/icons-material/Map"
import DownloadIcon from "@mui/icons-material/Download"
import PlaceIcon from "@mui/icons-material/Place"
import RouteIcon from "@mui/icons-material/Route"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import Heading from "../../components/UI/Heading/Heading"
import Paragraph from "../../components/UI/Paragraph/Paragraph"
import LayoutBand from "../../components/UI/Layoutband/LayoutBand"
import Map from "../../components/Map/Map"
import RoutePolyline from "../../components/Map/RoutePolyline"
import SelectedStopMarkers from "../../components/Map/SelectedStopMarkers"
import StartEndMarkers from "../../components/Map/StartEndMarkers"
import { TripPlanProvider } from "../../contexts/TripPlanContext"
import type { TripPlanData, Place } from "../../contexts/TripPlanContext"
import { getShareTrip } from "../../services/tripApi"
import useIsMobile from "../../hooks/useIsMobile"

function StopCard({ stop, index }: { stop: Place; index: number }) {
  return (
    <Card>
      <CardContent sx={{ py: "12px !important" }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 28, height: 28, fontSize: 13, flexShrink: 0 }}>
            {index}
          </Avatar>
          {stop.photoUrl && (
            <img
              src={stop.photoUrl}
              alt={stop.name}
              style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
            />
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0.25 }}>{stop.name}</Paragraph>
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

function TripShareInner({ trip }: { trip: TripPlanData }) {
  const isMobile = useIsMobile()
  const [snackbarMsg, setSnackbarMsg] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const enc = encodeURIComponent

  const showSnackbar = (msg: string) => {
    setSnackbarMsg(msg)
    setSnackbarOpen(true)
  }

  const waypoints = useMemo(() => trip.selectedStops.map((s) => s.latLng), [trip.selectedStops])

  const handleOpenGoogleMaps = () => {
    const wps = trip.selectedStops.map((s) => `${s.latLng.lat},${s.latLng.lng}`).join("|")
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${enc(trip.startLocation)}` +
      `&destination=${enc(trip.endLocation)}` +
      (wps ? `&waypoints=${enc(wps)}` : "") +
      `&travelmode=driving`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleOpenAppleMaps = () => {
    const url =
      `https://maps.apple.com/?saddr=${enc(trip.startLocation)}` +
      `&daddr=${enc(trip.endLocation)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleExportGPX = () => {
    const tripName = `${trip.startLocation} to ${trip.endLocation}`
    const wps = trip.selectedStops
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
      wps + "\n" +
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

  return (
    <LayoutBand>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Heading level="h1" size="h4" centered>Shared Trip</Heading>
        <Paragraph size="sm" centered sx={{ color: "text.secondary" }}>
          Someone shared this route with you via RouteScout.
        </Paragraph>
      </Box>

      {/* Stats card */}
      <Box sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
              sx={{ justifyContent: "space-around", mb: 2 }}
            >
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <PlaceIcon sx={{ color: "primary.main", mb: 0.5 }} />
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>{trip.selectedStops.length}</Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Stops</Paragraph>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <RouteIcon sx={{ color: "primary.main", mb: 0.5 }} />
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {trip.totalDistanceMiles > 0 ? trip.totalDistanceMiles : "—"}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Miles</Paragraph>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <AccessTimeIcon sx={{ color: "primary.main", mb: 0.5 }} />
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>{trip.totalDriveTime || "—"}</Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Drive Time</Paragraph>
              </Box>
            </Stack>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: { xs: 0.5, sm: 0.75 }, justifyContent: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PlaceIcon sx={{ fontSize: 14, color: "secondary.main", flexShrink: 0 }} />
                <Paragraph size="sm" sx={{ fontWeight: 600, textAlign: "center" }}>{trip.startLocation}</Paragraph>
              </Box>
              <Paragraph size="sm" sx={{ color: "text.disabled" }}>→</Paragraph>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Paragraph size="sm" sx={{ fontWeight: 600, textAlign: "center" }}>{trip.endLocation}</Paragraph>
                <PlaceIcon sx={{ fontSize: 14, color: "error.main", flexShrink: 0 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Map */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 3, height: isMobile ? 300 : 420, borderRadius: 2, overflow: "hidden" }}>
        <Map height="100%">
          {trip.startLatLng && trip.endLatLng && (
            <RoutePolyline
              startLatLng={trip.startLatLng}
              endLatLng={trip.endLatLng}
              waypoints={waypoints}
              fetchPlaces={false}
            />
          )}
          <StartEndMarkers />
          <SelectedStopMarkers />
        </Map>
      </Box>

      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {/* Open in Maps */}
        <Heading level="h2" size="h6" sx={{ mb: 1.5 }}>Open in Maps</Heading>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button variant="contained" color="primary" size="large" fullWidth startIcon={<MapIcon />} onClick={handleOpenGoogleMaps}>
              Google Maps
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button variant="outlined" color="primary" size="large" fullWidth startIcon={<MapIcon />} onClick={handleOpenAppleMaps}>
              Apple Maps
            </Button>
          </Grid>
        </Grid>

        {/* Export GPX */}
        <Heading level="h2" size="h6" sx={{ mb: 1.5 }}>Export</Heading>
        <Box sx={{ mb: 3 }}>
          <Button variant="outlined" fullWidth startIcon={<DownloadIcon />} onClick={handleExportGPX}>
            Export GPX File
          </Button>
        </Box>

        {/* Stop list */}
        {trip.selectedStops.length > 0 && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Heading level="h2" size="h6" sx={{ mb: 1.5 }}>Stops</Heading>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {trip.selectedStops.map((stop, i) => (
                <StopCard key={stop.id} stop={stop} index={i + 1} />
              ))}
            </Stack>
          </>
        )}
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

// Wraps TripShareInner in a TripPlanProvider seeded with the fetched trip,
// so Map sub-components (StartEndMarkers, SelectedStopMarkers) can read context.
function TripShareWithContext({ trip }: { trip: TripPlanData }) {
  return (
    <TripPlanProvider initialState={trip}>
      <TripShareInner trip={trip} />
    </TripPlanProvider>
  )
}

export default function TripShare() {
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<TripPlanData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("Invalid share link.")
      return
    }
    getShareTrip(id)
      .then(setTrip)
      .catch((err: Error) => setError(err.message))
  }, [id])

  if (error) {
    return (
      <LayoutBand>
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, textAlign: "center" }}>
          <Heading level="h1" size="h4" centered>Trip Not Found</Heading>
          <Paragraph size="sm" centered sx={{ color: "text.secondary" }}>
            {error === "Trip not found"
              ? "This share link is no longer valid or the trip has been deleted."
              : "Something went wrong loading this trip. Please try again."}
          </Paragraph>
        </Box>
      </LayoutBand>
    )
  }

  if (!trip) {
    return (
      <LayoutBand>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </LayoutBand>
    )
  }

  return <TripShareWithContext trip={trip} />
}
