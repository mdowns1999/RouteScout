import {
  CardMedia,
  Card,
  Box,
  Stack,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Rating,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import PlaceIcon from "@mui/icons-material/Place"
import DeleteIcon from "@mui/icons-material/Delete"
import ViewListIcon from "@mui/icons-material/ViewList"
import MapIcon from "@mui/icons-material/Map"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import Map from "../Map/Map"
import testImg from "../../assets/images/test.png"

// Extract style objects
const mediaStyles = {
  maxWidth: 100,
  maxHeight: 200,
  objectFit: "cover" as const, // Prevents image distortion
import RoutePolyline from "../Map/RoutePolyline"
import SelectedStopMarkers from "../Map/SelectedStopMarkers"
import StartEndMarkers from "../Map/StartEndMarkers"
import { useTripPlan, type Place } from "../../contexts/TripPlanContext"
import useIsMobile from "../../hooks/useIsMobile"
import { useState } from "react"
import LayoutBand from "../UI/Layoutband/LayoutBand"
}

function StopCard({
  stop,
  index,
  onRemove,
}: {
  stop: Place
  index: number
  onRemove: (id: string) => void
}) {
  return (
    <Card sx={{ display: "flex", alignItems: "flex-start", p: 1.5, gap: 1.5 }}>
      <Avatar sx={{ bgcolor: "primary.main", width: 28, height: 28, fontSize: 13, flexShrink: 0 }}>
        {index + 1}
      </Avatar>
      {stop.photoUrl ? (
        <CardMedia
          component="img"
          sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1, flexShrink: 0 }}
          image={stop.photoUrl}
          alt={stop.name}
        />
      ) : (
        <Box sx={{ width: 80, height: 80, bgcolor: "grey.200", borderRadius: 1, flexShrink: 0 }} />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0.25 }}>
          {stop.name}
        </Paragraph>
        {stop.rating > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
            <Rating value={stop.rating} precision={0.1} size="small" readOnly />
            <Paragraph size="xs">({stop.totalRatings})</Paragraph>
          </Box>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 0.5 }}>
          {stop.types.slice(0, 2).map((t) => (
            <Chip key={t} label={t.replace(/_/g, " ")} size="small" variant="outlined" />
          ))}
        </Box>
        <Paragraph size="xs" sx={{ color: "text.secondary" }}>
          {stop.distanceFromStart} mi • {stop.driveTimeFromStart} from start
        </Paragraph>
      </Box>
      <IconButton
        size="small"
        color="error"
        aria-label="remove stop"
        onClick={() => onRemove(stop.id)}
        sx={{ flexShrink: 0 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Card>
  )
}

export default function TripSummary() {
  const isMobile = useIsMobile()
  const [mobileView, setMobileView] = useState<"list" | "map">("list")
  const { state, dispatch } = useTripPlan()
  const {
    selectedStops,
    startLocation,
    endLocation,
    startLatLng,
    endLatLng,
    totalDistanceMiles,
    totalDriveTime,
  } = state
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
                  
  const removeStop = (id: string) => {
    dispatch({
      type: "SET_SELECTED_STOPS",
      payload: selectedStops.filter((s) => s.id !== id),
    })
  }

  return (
    <LayoutBand>
      {/* Mobile-only List / Map toggle */}
      {isMobile && (
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <ToggleButtonGroup
            value={mobileView}
            exclusive
            onChange={(_, v) => v && setMobileView(v)}
            fullWidth
            size="small"
          >
            <ToggleButton value="list">
              <ViewListIcon sx={{ mr: 0.75, fontSize: 18 }} />
              List
            </ToggleButton>
            <ToggleButton value="map">
              <MapIcon sx={{ mr: 0.75, fontSize: 18 }} />
              Map
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Main layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: { md: "calc(100vh - 240px)" },
          minHeight: { md: 500 },
          overflow: { md: "hidden" },
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            display: !isMobile ? "flex" : mobileView === "list" ? "flex" : "none",
            flexDirection: "column",
            borderRight: { md: 1 },
            borderColor: "divider",
            overflow: { md: "hidden" },
          }}
        >
          {/* Stats strip */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: "divider",
              flexShrink: 0,
              bgcolor: "background.paper",
            }}
          >
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={1}
              sx={{ justifyContent: "space-around", mb: 1.5 }}
            >
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {selectedStops.length}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Stops</Paragraph>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {totalDistanceMiles > 0 ? totalDistanceMiles : "—"}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Miles</Paragraph>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {totalDriveTime || "—"}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Drive Time</Paragraph>
              </Box>
            </Stack>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <PlaceIcon sx={{ fontSize: 14, color: "secondary.main", flexShrink: 0 }} />
              <Paragraph size="xs" sx={{ fontWeight: 600, color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {startLocation}
              </Paragraph>
              <Paragraph size="xs" sx={{ color: "text.disabled", flexShrink: 0 }}>→</Paragraph>
              <Paragraph size="xs" sx={{ fontWeight: 600, color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {endLocation}
              </Paragraph>
              <PlaceIcon sx={{ fontSize: 14, color: "error.main", flexShrink: 0 }} />
            </Box>
          </Box>

          {/* Scrollable stop list */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
            {selectedStops.length === 0 ? (
              <Paragraph size="sm" sx={{ p: 1 }}>
                No stops selected. Go back to add some!
              </Paragraph>
            ) : (
              <Stack spacing={1.5}>
                {selectedStops.map((stop, index) => (
                  <StopCard key={stop.id} stop={stop} index={index} onRemove={removeStop} />
                ))}
              </Stack>
            )}
          </Box>
        </Box>

        {/* Outer clipping wrapper: collapses to 0 when hidden on mobile */}
        <Box
          sx={{
            flex: !isMobile ? 1 : undefined,
            height: !isMobile ? "100%" : mobileView === "map" ? "calc(100vh - 180px)" : 0,
            overflow: "hidden",
          }}
        >
          {/* Inner map: always at full size so Google Maps initializes with real dimensions */}
          <Box sx={{ width: "100%", height: !isMobile ? "100%" : "calc(100vh - 180px)" }}>
            <Map height="100%">
              {startLatLng && endLatLng && (
                <RoutePolyline
                  startLatLng={startLatLng}
                  endLatLng={endLatLng}
                  fetchPlaces={false}
                />
              )}
              <StartEndMarkers />
              <SelectedStopMarkers />
            </Map>
          </Box>
        </Box>
      </Box>
        </Grid>
      </Grid>
    </LayoutBand>
  )
}
