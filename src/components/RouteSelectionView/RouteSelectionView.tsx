import { useEffect, useRef, useState } from "react"
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import MapIcon from "@mui/icons-material/Map"
import ViewListIcon from "@mui/icons-material/ViewList"
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
import Map from "../Map/Map"
import StartEndMarkers from "../Map/StartEndMarkers"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import LayoutBand from "../UI/Layoutband/LayoutBand"
import { useTripPlan, type RouteOption, type RouteOptionId } from "../../contexts/TripPlanContext"
import { decodePolyline } from "../../utils/routeUtils"
import useIsMobile from "../../hooks/useIsMobile"

// --- Constants ---

const ROUTE_DISMISSED_KEY = "routescout_dismissed_route"
const SECONDARY_COLOR = "#3f7d58"

interface RouteConfig {
  id: RouteOptionId
  label: string
  body: Record<string, unknown>
}

const ROUTE_CONFIGS: RouteConfig[] = [
  { id: "fastest",     label: "Fastest Route",       body: { routingPreference: "TRAFFIC_AWARE" } },
  { id: "scenic",      label: "Scenic Route",         body: { routingPreference: "TRAFFIC_UNAWARE" } },
  { id: "no_highways", label: "Avoid Highways",       body: { routeModifiers: { avoidHighways: true } } },
  { id: "no_tolls",    label: "No Toll Roads",        body: { routeModifiers: { avoidTolls: true } } },
]

// --- API response type ---

interface RouteApiResponse {
  routes?: {
    polyline?: { encodedPolyline?: string }
    distanceMeters?: number
    duration?: string
    travelAdvisory?: {
      tollInfo?: { estimatedPrice?: unknown[] }
    }
  }[]
}

function parseRoute(id: RouteOptionId, label: string, data: RouteApiResponse): RouteOption | null {
  const r = data.routes?.[0]
  if (!r?.polyline?.encodedPolyline) return null
  const distanceMiles = Math.round((r.distanceMeters ?? 0) * 0.000621371 * 10) / 10
  const durationSeconds = parseInt((r.duration ?? "0s").replace("s", ""), 10)
  const durationMinutes = Math.round(durationSeconds / 60)
  const hasTolls = (r.travelAdvisory?.tollInfo?.estimatedPrice?.length ?? 0) > 0
  return { id, label, distanceMiles, durationMinutes, hasTolls, encodedPolyline: r.polyline.encodedPolyline }
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// --- Route polylines renderer (inside the Map) ---

function RoutePolylines({ routes, selectedId }: { routes: RouteOption[]; selectedId: RouteOptionId | null }) {
  const map = useMap()
  const mapsLib = useMapsLibrary("maps")
  const coreLib = useMapsLibrary("core")
  const polylinesRef = useRef<google.maps.Polyline[]>([])

  useEffect(() => {
    if (!map || !mapsLib || !coreLib) return

    // Cleanup previous polylines
    polylinesRef.current.forEach((p) => p.setMap(null))
    polylinesRef.current = []

    if (routes.length === 0) return

    const bounds = new coreLib.LatLngBounds()

    routes.forEach((route) => {
      const path = decodePolyline(route.encodedPolyline)
      const isSelected = route.id === selectedId
      const polyline = new mapsLib.Polyline({
        path: path.map((p) => ({ lat: p.lat, lng: p.lng })),
        strokeColor: SECONDARY_COLOR,
        strokeWeight: isSelected ? 5 : 2,
        strokeOpacity: isSelected ? 0.85 : 0.3,
        map,
      })
      polylinesRef.current.push(polyline)
      // Extend bounds: use selected route if one is chosen, otherwise all routes
      if (isSelected || selectedId === null) {
        path.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }))
      }
    })

    // If no route selected yet, fit all routes into view
    if (selectedId === null) {
      routes.forEach((route) => {
        decodePolyline(route.encodedPolyline).forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }))
      })
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, 48)
    }

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null))
      polylinesRef.current = []
    }
  }, [map, mapsLib, coreLib, routes, selectedId])

  return null
}

// --- Main component ---

export default function RouteSelectionView() {
  const isMobile = useIsMobile()
  const { state, dispatch } = useTripPlan()
  const { startLatLng, endLatLng, routeOptions, selectedRoute, selectedInterests } = state

  const [mobileView, setMobileView] = useState<"routes" | "map">("routes")
  const [isLoading, setIsLoading] = useState(
    () => routeOptions.length === 0 && !!startLatLng && !!endLatLng
  )
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(ROUTE_DISMISSED_KEY))

  // Fetch routes on mount if not already loaded
  useEffect(() => {
    if (!startLatLng || !endLatLng || routeOptions.length > 0) return

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string

    const base = {
      origin: { location: { latLng: { latitude: startLatLng.lat, longitude: startLatLng.lng } } },
      destination: { location: { latLng: { latitude: endLatLng.lat, longitude: endLatLng.lng } } },
      travelMode: "DRIVE",
      polylineQuality: "HIGH_QUALITY",
    }

    const fetches = ROUTE_CONFIGS.map((cfg) =>
      fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "routes.polyline.encodedPolyline,routes.distanceMeters,routes.duration,routes.travelAdvisory.tollInfo",
        },
        body: JSON.stringify({ ...base, ...cfg.body }),
      })
        .then((r) => r.json() as Promise<RouteApiResponse>)
        .then((data) => parseRoute(cfg.id, cfg.label, data))
        .catch(() => null)
    )

    Promise.all(fetches).then((results) => {
      const loaded = results.filter((r): r is RouteOption => r !== null)
      dispatch({ type: "SET_ROUTE_OPTIONS", payload: loaded })
      if (loaded.length < 2) {
        setLoadError("Some route options couldn't be loaded. You can still continue with what's available.")
      }
      setIsLoading(false)
    })
  }, [startLatLng, endLatLng, routeOptions.length, dispatch])

  const handleRouteSelect = (route: RouteOption) => {
    dispatch({ type: "SET_SELECTED_ROUTE", payload: route })
    dispatch({
      type: "SET_ROUTE_STATS",
      payload: {
        distanceMiles: route.distanceMiles,
        driveTime: formatDuration(route.durationMinutes),
      },
    })
    // Pre-populate interests only if user hasn't made selections yet
    if (selectedInterests.length === 0) {
      if (route.id === "scenic") {
        dispatch({ type: "SET_SELECTED_INTERESTS", payload: ["parks_trails", "scenic_viewpoints", "camping_rv"] })
      } else if (route.id === "no_highways") {
        dispatch({ type: "SET_SELECTED_INTERESTS", payload: ["hidden_gems", "local_shops", "restaurants"] })
      }
    }
  }

  const dismissWelcome = () => {
    localStorage.setItem(ROUTE_DISMISSED_KEY, "1")
    setShowWelcome(false)
  }

  const routeCardList = (
    <Stack spacing={1.5}>
      {showWelcome && (
        <Card variant="outlined" sx={{ bgcolor: "primary.50", borderColor: "primary.200" }}>
          <CardContent sx={{ py: "12px !important", pr: "12px !important" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Paragraph size="sm" sx={{ flex: 1 }}>
                We found multiple routes for your trip. Pick the one that fits your style — we'll find stops along it.
              </Paragraph>
              <IconButton size="small" onClick={dismissWelcome} sx={{ flexShrink: 0, mt: -0.5 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}

      {loadError && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          {loadError}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : routeOptions.length === 0 ? (
        <Paragraph size="sm" sx={{ p: 1, color: "text.secondary" }}>
          No routes found. Go back and check your locations.
        </Paragraph>
      ) : (
        routeOptions.map((route) => {
          const isSelected = selectedRoute?.id === route.id
          return (
            <Card
              key={route.id}
              variant="outlined"
              sx={{
                borderColor: isSelected ? "secondary.main" : "divider",
                borderWidth: isSelected ? 2 : 1,
                bgcolor: isSelected ? "action.selected" : "background.paper",
                transition: "all 0.15s",
              }}
            >
              <CardActionArea onClick={() => handleRouteSelect(route)}>
                <CardContent sx={{ py: 1.5 }}>
                  <Paragraph size="sm" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {route.label}
                  </Paragraph>
                  <Paragraph size="xs" sx={{ color: "text.secondary", mb: route.hasTolls ? 0.75 : 0 }}>
                    {route.distanceMiles} mi · {formatDuration(route.durationMinutes)}
                  </Paragraph>
                  {route.hasTolls && (
                    <Chip label="Has Tolls" color="warning" size="small" />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          )
        })
      )}
    </Stack>
  )

  const mapArea = (
    <Map height="100%">
      <RoutePolylines routes={routeOptions} selectedId={selectedRoute?.id ?? null} />
      <StartEndMarkers />
    </Map>
  )

  return (
    <LayoutBand spacingDirection="all">
      {/* Mobile-only Routes / Map toggle */}
      {isMobile && (
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <ToggleButtonGroup
            value={mobileView}
            exclusive
            onChange={(_, v) => v && setMobileView(v)}
            fullWidth
            size="small"
          >
            <ToggleButton value="routes">
              <ViewListIcon sx={{ mr: 0.75, fontSize: 18 }} />
              Routes
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
          alignItems: { md: "stretch" },
          height: { md: "calc(100vh - 450px)" },
          minHeight: { md: 420 },
          overflow: { md: "hidden" },
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            height: { md: "100%" },
            display: !isMobile ? "flex" : mobileView === "routes" ? "flex" : "none",
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
            <Heading level="h2" size="h6" sx={{ mb: 0.25 }}>
              Choose Your Route
            </Heading>
            <Paragraph size="xs" sx={{ color: "text.secondary" }}>
              Select the route that fits your trip.
            </Paragraph>
          </Box>

          {/* Scrollable route list */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
            {routeCardList}
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
            {mapArea}
          </Box>
        </Box>
      </Box>
    </LayoutBand>
  )
}
