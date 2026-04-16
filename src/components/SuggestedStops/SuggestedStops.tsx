import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Drawer,
  Fab,
  Rating,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import ViewListIcon from "@mui/icons-material/ViewList"
import MapIcon from "@mui/icons-material/Map"
import TuneIcon from "@mui/icons-material/Tune"
import Map from "../Map/Map"
import RoutePolyline from "../Map/RoutePolyline"
import StopMarkers from "../Map/StopMarkers"
import StartEndMarkers from "../Map/StartEndMarkers"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import { useTripPlan, type Place, type StopFilters } from "../../contexts/TripPlanContext"
import { CATEGORIES, INTEREST_TYPE_MAP } from "../../constants/categories"
import useIsMobile from "../../hooks/useIsMobile"
import { memo, useCallback, useMemo, useState } from "react"
import LayoutBand from "../UI/Layoutband/LayoutBand"

// --- Stop Card ---

const StopCard = memo(function StopCard({
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
})

// --- Filter Panel ---

interface FilterPanelContentProps {
  filters: StopFilters
  onApply: (filters: StopFilters) => void
  onReset: () => void
  onClose: () => void
  availableCategories: string[]
}

function FilterPanelContent({ filters, onApply, onReset, onClose, availableCategories }: FilterPanelContentProps) {
  const [draft, setDraft] = useState<StopFilters>({ ...filters })

  const handleApply = () => {
    onApply(draft)
    onClose()
  }

  const handleReset = () => {
    const empty: StopFilters = { minRating: 0, maxPriceLevel: 0, maxDistanceMiles: 0, categoryIds: [] }
    setDraft(empty)
    onReset()
    onClose()
  }

  const toggleCategory = (catId: string) => {
    setDraft((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId],
    }))
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
      <Heading level="h2" size="h6" sx={{ mb: 2 }}>Filters</Heading>

      <Box sx={{ flex: 1, overflowY: "auto", padding: 3 }}>
        {/* Categories */}
        {availableCategories.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Paragraph size="sm" sx={{ fontWeight: 600, mb: 1 }}>Categories</Paragraph>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              <Chip
                label="All"
                size="small"
                variant={draft.categoryIds.length === 0 ? "filled" : "outlined"}
                color={draft.categoryIds.length === 0 ? "warning" : "default"}
                onClick={() => setDraft((prev) => ({ ...prev, categoryIds: [] }))}
              />
              {availableCategories.map((catId) => {
                const cat = CATEGORIES.find((c) => c.id === catId)
                if (!cat) return null
                const isActive = draft.categoryIds.includes(catId)
                return (
                  <Chip
                    key={catId}
                    label={cat.title}
                    size="small"
                    variant={isActive ? "filled" : "outlined"}
                    color={isActive ? "warning" : "default"}
                    onClick={() => toggleCategory(catId)}
                  />
                )
              })}
            </Box>
          </Box>
        )}

        {/* Minimum Rating */}
        <Box sx={{ mb: 3 }}>
          <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0.5 }}>
            Minimum Rating:{" "}
            <span style={{ fontWeight: 400 }}>
              {draft.minRating > 0 ? `${draft.minRating.toFixed(1)}+` : "Any"}
            </span>
          </Paragraph>
          <Slider
            min={0}
            max={5}
            step={0.5}
            value={draft.minRating}
            onChange={(_, v) => setDraft((prev) => ({ ...prev, minRating: v as number }))}
            marks={[{ value: 0, label: "Any" }, { value: 5, label: "5★" }]}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Max Price Level */}
        <Box sx={{ mb: 3 }}>
          <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0.5 }}>
            Max Price Level:{" "}
            <span style={{ fontWeight: 400 }}>
              {draft.maxPriceLevel > 0 ? "$".repeat(draft.maxPriceLevel) : "Any"}
            </span>
          </Paragraph>
          <Slider
            min={0}
            max={4}
            step={1}
            value={draft.maxPriceLevel}
            onChange={(_, v) => setDraft((prev) => ({ ...prev, maxPriceLevel: v as number }))}
            marks={[{ value: 0, label: "Any" }, { value: 1, label: "$" }, { value: 2, label: "$$" }, { value: 3, label: "$$$" }, { value: 4, label: "$$$$" }]}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Max Distance */}
        <Box sx={{ mb: 3 }}>
          <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0.5 }}>
            Max Distance from Route:{" "}
            <span style={{ fontWeight: 400 }}>
              {draft.maxDistanceMiles > 0 ? `${draft.maxDistanceMiles} mi` : "Any"}
            </span>
          </Paragraph>
          <Slider
            min={0}
            max={50}
            step={5}
            value={draft.maxDistanceMiles}
            onChange={(_, v) => setDraft((prev) => ({ ...prev, maxDistanceMiles: v as number }))}
            marks={[{ value: 0, label: "Any" }, { value: 50, label: "50 mi" }]}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      {/* Action buttons */}
      <Stack direction="row" spacing={1} sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
        <Button variant="text" onClick={handleReset} sx={{ flex: 1 }}>
          Reset
        </Button>
        <Button variant="contained" color="secondary" onClick={handleApply} sx={{ flex: 2 }}>
          Apply Filters
        </Button>
      </Stack>
    </Box>
  )
}

// --- Main component ---

export default function SuggestedStops() {
  const isMobile = useIsMobile()
  const [mobileView, setMobileView] = useState<"list" | "map">("list")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { state, dispatch } = useTripPlan()
  const { selectedStops, availableStops, startLatLng, endLatLng, startLocation, endLocation, stopFilters } = state

  const handleStopToggle = useCallback((stop: Place) => {
    const isSelected = selectedStops.some((s) => s.id === stop.id)
    dispatch({
      type: "SET_SELECTED_STOPS",
      payload: isSelected
        ? selectedStops.filter((s) => s.id !== stop.id)
        : [...selectedStops, stop],
    })
  }, [selectedStops, dispatch])

  const isLoadingStops = startLatLng !== null && availableStops.length === 0

  // Categories that have at least one matching stop
  const availableCategories = useMemo(
    () =>
      state.selectedInterests.filter((catId) =>
        availableStops.some((s) =>
          (INTEREST_TYPE_MAP[catId] ?? []).some((t) => s.types.includes(t))
        )
      ),
    [availableStops, state.selectedInterests]
  )

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (stopFilters.minRating > 0) count++
    if (stopFilters.maxPriceLevel > 0) count++
    if (stopFilters.maxDistanceMiles > 0) count++
    if (stopFilters.categoryIds.length > 0) count++
    return count
  }, [stopFilters])

  // Apply all filters (AND logic)
  const displayedStops = useMemo(() => {
    const f = stopFilters
    return availableStops.filter((stop) => {
      if (f.minRating > 0 && stop.rating < f.minRating) return false
      if (f.maxPriceLevel > 0 && stop.priceLevel > 0 && stop.priceLevel > f.maxPriceLevel) return false
      if (f.maxDistanceMiles > 0 && stop.distanceFromStart > f.maxDistanceMiles) return false
      if (f.categoryIds.length > 0) {
        const matchesCategory = f.categoryIds.some((catId) =>
          (INTEREST_TYPE_MAP[catId] ?? []).some((t) => stop.types.includes(t))
        )
        if (!matchesCategory) return false
      }
      return true
    })
  }, [availableStops, stopFilters])

  const handleApplyFilters = useCallback((filters: StopFilters) => {
    dispatch({ type: "SET_STOP_FILTERS", payload: filters })
  }, [dispatch])

  const handleResetFilters = useCallback(() => {
    dispatch({
      type: "SET_STOP_FILTERS",
      payload: { minRating: 0, maxPriceLevel: 0, maxDistanceMiles: 0, categoryIds: [] },
    })
  }, [dispatch])

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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
              <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0 }}>
                {startLocation} → {endLocation}
              </Paragraph>
              <Badge badgeContent={activeFilterCount || null} color="error">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<TuneIcon />}
                  onClick={() => setFiltersOpen(true)}
                  sx={{ flexShrink: 0 }}
                >
                  Filters
                </Button>
              </Badge>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={`${selectedStops.length} stop${selectedStops.length !== 1 ? "s" : ""} selected`}
                size="small"
                color="secondary"
              />
              {!isLoadingStops && availableStops.length > 0 && (
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>
                  of {displayedStops.length} {activeFilterCount > 0 ? "filtered" : "available"}
                </Paragraph>
              )}
            </Box>
          </Box>

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
                No stops match your filters. Try adjusting them.
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

        {/* Map */}
        <Box
          sx={{
            flex: !isMobile ? 1 : undefined,
            height: !isMobile ? "100%" : mobileView === "map" ? "calc(100vh - 180px)" : 0,
            overflow: "hidden",
          }}
        >
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

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        anchor={isMobile ? "bottom" : "left"}
        PaperProps={{
          sx: isMobile
            ? { height: "70vh", borderRadius: "16px 16px 0 0" }
            : { width: "35%", minWidth: 280 },
        }}
      >
        <FilterPanelContent
          filters={stopFilters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onClose={() => setFiltersOpen(false)}
          availableCategories={availableCategories}
        />
      </Drawer>

      {/* Mobile: FAB */}
      {isMobile && mobileView === "list" && (
        <Fab
          color="secondary"
          size="medium"
          sx={{ position: "fixed", bottom: 80, right: 16, zIndex: 50 }}
          onClick={() => setFiltersOpen(true)}
        >
          <Badge badgeContent={activeFilterCount || null} color="error">
            <TuneIcon />
          </Badge>
        </Fab>
      )}
    </LayoutBand>
  )
}
