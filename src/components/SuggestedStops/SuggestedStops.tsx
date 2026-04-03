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
import { CATEGORIES, INTEREST_TYPE_MAP } from "../../constants/categories"
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
        {stop.address && (
          <Paragraph size="xs" sx={{ color: "text.secondary", mt: 0.25 }}>
            {stop.address}
          </Paragraph>
        )}
      </CardContent>
      <Checkbox
        checked={isSelected}
        onChange={() => onToggle(stop)}
        onClick={(e) => e.stopPropagation()}
        color="warning"
        sx={{ mr: 0.5 }}
      />
    </Card>
  )
}

export default function SuggestedStops() {
  const isMobile = useIsMobile()
  const [mobileView, setMobileView] = useState<"list" | "map">("list")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
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

  // Categories that have at least one matching stop
  const availableCategories = state.selectedInterests.filter((catId) =>
    availableStops.some((s) =>
      (INTEREST_TYPE_MAP[catId] ?? []).some((t) => s.types.includes(t))
    )
  )

  const displayedStops = activeCategory
    ? availableStops.filter((s) =>
        (INTEREST_TYPE_MAP[activeCategory] ?? []).some((t) => s.types.includes(t))
      )
    : availableStops

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
                  of {displayedStops.length} {activeCategory ? "filtered" : "available"}
                </Paragraph>
              )}
            </Box>
          </Box>

          {/* Category filter chips */}
          {availableStops.length > 0 && availableCategories.length > 1 && (
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                gap: 0.75,
                overflowX: "auto",
                flexShrink: 0,
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              <Chip
                label="All"
                size="small"
                variant={!activeCategory ? "filled" : "outlined"}
                color={!activeCategory ? "warning" : "default"}
                onClick={() => setActiveCategory(null)}
                sx={{ flexShrink: 0 }}
              />
              {availableCategories.map((catId) => {
                const cat = CATEGORIES.find((c) => c.id === catId)!
                const isActive = activeCategory === catId
                return (
                  <Chip
                    key={catId}
                    label={cat.title}
                    size="small"
                    variant={isActive ? "filled" : "outlined"}
                    color={isActive ? "warning" : "default"}
                    onClick={() => setActiveCategory(isActive ? null : catId)}
                    sx={{ flexShrink: 0 }}
                  />
                )
              })}
            </Box>
          )}

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
            ) : displayedStops.length === 0 ? (
              <Paragraph size="sm" sx={{ p: 1 }}>
                No stops found for this category.
              </Paragraph>
            ) : (
              <Stack spacing={1}>
                {displayedStops.map((stop) => {
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
