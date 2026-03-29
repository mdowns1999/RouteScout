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
import DeleteIcon from "@mui/icons-material/Delete"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import LayoutBand from "../UI/Layoutband/LayoutBand"
import Map from "../Map/Map"
import RoutePolyline from "../Map/RoutePolyline"
import SelectedStopMarkers from "../Map/SelectedStopMarkers"
import { useTripPlan } from "../../contexts/TripPlanContext"

const mediaStyles = {
  width: 80,
  height: 80,
  objectFit: "cover" as const,
  flexShrink: 0,
}

export default function TripSummary() {
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

  const removeStop = (id: string) => {
    dispatch({
      type: "SET_SELECTED_STOPS",
      payload: selectedStops.filter((s) => s.id !== id),
    })
  }

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
        <Chip
          label={`${selectedStops.length} Stop${selectedStops.length !== 1 ? "s" : ""} Selected`}
          color="primary"
        />
      </Box>

      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid size={5}>
          <Stack spacing={2}>
            {/* Trip Overview Card */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <RouteIcon />
                  <Heading level="h2" size="h4">Trip Overview</Heading>
                </Stack>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Paragraph size="sm">Stops:</Paragraph>
                    <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                      {selectedStops.length}
                    </Paragraph>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Paragraph size="sm">Total Distance:</Paragraph>
                    <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                      {totalDistanceMiles > 0 ? `${totalDistanceMiles} miles` : "—"}
                    </Paragraph>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Paragraph size="sm">Estimated Drive Time:</Paragraph>
                    <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                      {totalDriveTime || "—"}
                    </Paragraph>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Route Stops Card */}
            <Card>
              <CardContent>
                <Heading level="h2" size="h5" sx={{ mb: 2 }}>Route Stops</Heading>
                <Stack spacing={2}>
                  {/* Start */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PlaceIcon color="primary" />
                    <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                      Start: {startLocation}
                    </Paragraph>
                  </Box>

                  {selectedStops.length === 0 ? (
                    <Paragraph size="sm">No stops selected.</Paragraph>
                  ) : (
                    selectedStops.map((stop, index) => (
                      <Box key={stop.id}>
                        <Divider sx={{ mb: 2 }} />
                        <Card sx={{ display: "flex", alignItems: "flex-start", p: 1.5, gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32, fontSize: 14 }}>
                            {index + 1}
                          </Avatar>
                          {stop.photoUrl ? (
                            <CardMedia
                              component="img"
                              sx={mediaStyles}
                              image={stop.photoUrl}
                              alt={stop.name}
                            />
                          ) : (
                            <Box sx={{ ...mediaStyles, bgcolor: "grey.200" }} />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Paragraph size="sm" sx={{ fontWeight: "bold", mb: 0.5 }}>
                              {stop.name}
                            </Paragraph>
                            {stop.rating > 0 && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                                <Rating value={stop.rating} precision={0.1} size="small" readOnly />
                                <Paragraph size="xs">({stop.totalRatings})</Paragraph>
                              </Box>
                            )}
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 0.5 }}>
                              {stop.types.slice(0, 3).map((t) => (
                                <Chip key={t} label={t.replace(/_/g, " ")} size="small" />
                              ))}
                            </Box>
                            <Paragraph size="xs">
                              {stop.distanceFromStart} mi • {stop.driveTimeFromStart} from start
                            </Paragraph>
                          </Box>
                          <IconButton
                            size="small"
                            aria-label="remove stop"
                            color="error"
                            onClick={() => removeStop(stop.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Card>
                      </Box>
                    ))
                  )}

                  <Divider />

                  {/* Destination */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PlaceIcon color="error" />
                    <Paragraph size="sm" sx={{ fontWeight: "bold" }}>
                      Destination: {endLocation}
                    </Paragraph>
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
            <Map height="600px">
              {startLatLng && endLatLng && (
                <RoutePolyline
                  startLatLng={startLatLng}
                  endLatLng={endLatLng}
                  fetchPlaces={false}
                />
              )}
              <SelectedStopMarkers />
            </Map>
          </Box>
        </Grid>
      </Grid>
    </LayoutBand>
  )
}
