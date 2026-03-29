import {
  CardMedia,
  Card,
  CardContent,
  Box,
  Stack,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Rating,
} from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import RouteIcon from "@mui/icons-material/Route"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import LayoutBand from "../UI/Layoutband/LayoutBand"
import Map from "../Map/Map"
import RoutePolyline from "../Map/RoutePolyline"
import StopMarkers from "../Map/StopMarkers"
import { useTripPlan, type Place } from "../../contexts/TripPlanContext"

const mediaStyles = {
  width: 80,
  height: 80,
  objectFit: "cover" as const,
  flexShrink: 0,
}

export default function SuggestedStops() {
  const { state, dispatch } = useTripPlan()
  const { selectedStops, availableStops, startLatLng, endLatLng, startLocation, endLocation } = state

  const handleStopToggle = (stop: Place) => {
    const isSelected = selectedStops.some((s) => s.id === stop.id)
    dispatch({
      type: "SET_SELECTED_STOPS",
      payload: isSelected
        ? selectedStops.filter((s) => s.id !== stop.id)
        : [...selectedStops, stop],
    })
  }

  const isLoadingStops = startLatLng !== null && availableStops.length === 0

  return (
    <LayoutBand>
      <Heading level="h1" size="h3" centered>
        Suggested Stops Along Your Route
      </Heading>
      <Paragraph centered>
        Explore stops along your route and select the ones you'd like to visit.
        Hover over map pins for details.
      </Paragraph>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Chip
          label={`${selectedStops.length} Stop${selectedStops.length !== 1 ? "s" : ""} Selected`}
          color="primary"
        />
      </Box>

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
                  <Paragraph size="sm">From: {startLocation}</Paragraph>
                  <Paragraph size="sm">To: {endLocation}</Paragraph>
                  <Divider sx={{ my: 1 }} />
                  <Paragraph size="sm">
                    {availableStops.length} stops available along your route
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

                {isLoadingStops ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : availableStops.length === 0 ? (
                  <Paragraph size="sm">
                    No stops found. Try selecting more interests.
                  </Paragraph>
                ) : (
                  availableStops.map((stop) => (
                    <Card key={stop.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Checkbox
                        checked={selectedStops.some((s) => s.id === stop.id)}
                        onChange={() => handleStopToggle(stop)}
                      />
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
                      <CardContent sx={{ flex: 1, py: "8px !important" }}>
                        <Heading level="h3" size="h6">
                          {stop.name}
                        </Heading>
                        {stop.rating > 0 && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                            <Rating value={stop.rating} precision={0.1} size="small" readOnly />
                            <Paragraph size="xs">({stop.totalRatings})</Paragraph>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
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
                <RoutePolyline startLatLng={startLatLng} endLatLng={endLatLng} />
              )}
              <StopMarkers />
            </Map>
          </Box>
        </Grid>
      </Grid>
    </LayoutBand>
  )
}
