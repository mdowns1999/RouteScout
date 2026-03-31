import {
  Card,
  CardContent,
  Box,
  Stack,
  Grid,
  Divider,
  Chip,
} from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import RouteIcon from "@mui/icons-material/Route"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
<<<<<<< Updated upstream
import LayoutBand from "../UI/Layoutband/LayoutBand"
import Map from "../Map/Map"
import { useTripPlan } from "../../contexts/TripPlanContext"
import testImg from "../../assets/images/test.png"

// Extract style objects
const mediaStyles = {
  maxWidth: 100,
  maxHeight: 200,
  objectFit: "cover" as const, // Prevents image distortion
=======
import { useTripPlan, type Place } from "../../contexts/TripPlanContext"
import useIsMobile from "../../hooks/useIsMobile"
import { useState } from "react"
import LayoutBand from "../UI/Layoutband/LayoutBand"

function StopCard({
  stop,
  isSelected,
  onToggle,
}: {
  stop: Place
  isSelected: boolean
  onToggle: (stop: Place) => void
}) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        bgcolor: isSelected ? "action.selected" : "background.paper",
        "&:hover": { bgcolor: isSelected ? "action.selected" : "action.hover" },
      }}
      onClick={() => onToggle(stop)}
    >
      <CardContent sx={{ flex: 1, py: "8px !important", px: 1.5 }}>
        <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0 }}>
          {stop.name}
        </Paragraph>
        {stop.rating > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Rating value={stop.rating} precision={0.1} size="small" readOnly />
            <Paragraph size="xs">({stop.totalRatings})</Paragraph>
          </Box>
        )}
      </CardContent>
      <Checkbox
        checked={isSelected}
        onChange={() => onToggle(stop)}
        onClick={(e) => e.stopPropagation()}
        color="secondary"
        sx={{ mr: 0.5 }}
      />
    </Card>
  )
>>>>>>> Stashed changes
}

export default function SuggestedStops() {
  const { state, dispatch } = useTripPlan()
  const selectedStops = state.selectedStops

  const handleStopToggle = (stopId: string) => {
    const newStops = selectedStops.includes(stopId)
      ? selectedStops.filter((id) => id !== stopId)
      : [...selectedStops, stopId]
    dispatch({ type: "SET_SELECTED_STOPS", payload: newStops })
  }

  return (
<<<<<<< Updated upstream
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
=======
    <LayoutBand spacingDirection="all">
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
>>>>>>> Stashed changes

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
                    checked={selectedStops.includes("artisan-market")}
                    onChange={() => handleStopToggle("artisan-market")}
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
              height: "600px",
              width: "100%",
              border: "1px solid #ddd",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Map height="600px" />
          </Box>
<<<<<<< Updated upstream
        </Grid>
      </Grid>
=======

          {/* Scrollable stop list */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
            {isLoadingStops ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : availableStops.length === 0 ? (
              <Paragraph size="sm" sx={{ p: 1 }}>
                No stops found. Try selecting more interests.
              </Paragraph>
            ) : (
              <Stack spacing={1}>
                {availableStops.map((stop) => {
                  const isSelected = selectedStops.some((s) => s.id === stop.id)
                  return (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      isSelected={isSelected}
                      onToggle={handleStopToggle}
                    />
                  )
                })}
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
                <RoutePolyline startLatLng={startLatLng} endLatLng={endLatLng} />
              )}
              <StartEndMarkers />
              <StopMarkers />
            </Map>
          </Box>
        </Box>
      </Box>
>>>>>>> Stashed changes
    </LayoutBand>
  )
}
