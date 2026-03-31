import {
  Card,
  CardContent,
  Box,
  Stack,
  Chip,
  CircularProgress,
  Rating,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import ViewListIcon from "@mui/icons-material/ViewList"
import MapIcon from "@mui/icons-material/Map"
import Map from "../Map/Map"
import RoutePolyline from "../Map/RoutePolyline"
import StopMarkers from "../Map/StopMarkers"
import StartEndMarkers from "../Map/StartEndMarkers"
import Paragraph from "../UI/Paragraph/Paragraph"
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
      {stop.photoUrl ? (
        <CardMedia
          component="img"
          sx={{ width: 64, height: 64, objectFit: "cover", flexShrink: 0 }}
          image={stop.photoUrl}
          alt={stop.name}
        />
      ) : (
        <Box sx={{ width: 64, height: 64, bgcolor: "grey.200", flexShrink: 0 }} />
      )}
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
}

export default function SuggestedStops() {
  const isMobile = useIsMobile()
  const [mobileView, setMobileView] = useState<"list" | "map">("list")
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
                  <Paragraph size="sm">To:</Paragraph>
                  <Paragraph size="sm">From:</Paragraph>
                  <Divider />
                  <Paragraph size="sm">
                    2 Stops available along your route
                  </Paragraph>
                </div>
              </CardContent>
            </Card>
  return (
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
          {/* Sidebar header */}
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
            <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0.5 }}>
              {startLocation} → {endLocation}
            </Paragraph>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={`${selectedStops.length} stop${selectedStops.length !== 1 ? "s" : ""} selected`}
                size="small"
                color="secondary"
              />
              {!isLoadingStops && availableStops.length > 0 && (
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>
                  of {availableStops.length} available
                </Paragraph>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

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
    </LayoutBand>
  )
}
