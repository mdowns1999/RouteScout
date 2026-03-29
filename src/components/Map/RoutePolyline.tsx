import { useEffect } from "react"
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
import { useTripPlan, type LatLng, type Place } from "../../contexts/TripPlanContext"

interface RoutePolylineProps {
  startLatLng: LatLng
  endLatLng: LatLng
  fetchPlaces?: boolean
}

// --- Constants ---

const INTEREST_TYPE_MAP: Record<string, string[]> = {
  food:        ["restaurant", "cafe", "bakery", "bar"],
  nature:      ["park", "campground", "national_park", "hiking_area"],
  history:     ["museum", "historical_landmark", "art_gallery"],
  adventure:   ["sports_complex", "rock_climbing_gym"],
  photography: ["scenic_point", "viewpoint"],
  arts:        ["art_gallery", "performing_arts_theater"],
  music:       ["night_club", "bar"],
  shopping:    ["shopping_mall", "market", "store"],
  attractions: ["tourist_attraction", "amusement_park"],
  hidden:      ["point_of_interest"],
}

// --- Helper types ---

interface ApiPlace {
  id: string
  displayName?: { text: string }
  formattedAddress?: string
  location?: { latitude: number; longitude: number }
  rating?: number
  userRatingCount?: number
  photos?: { name: string }[]
  types?: string[]
  primaryType?: string
}

// --- Pure helper functions ---

function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = []
  let index = 0, lat = 0, lng = 0
  while (index < encoded.length) {
    let shift = 0, result = 0, byte: number
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1
    shift = 0; result = 0
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1
    points.push({ lat: lat / 1e5, lng: lng / 1e5 })
  }
  return points
}

function haversineDistanceMiles(a: LatLng, b: LatLng): number {
  const R = 3958.8
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(h))
}

function sampleMidpoints(path: LatLng[], intervalMiles: number): LatLng[] {
  if (path.length < 2) return path.length === 1 ? [path[0]] : []
  const points: LatLng[] = []
  let accumulated = 0, nextSample = intervalMiles
  for (let i = 1; i < path.length; i++) {
    const segDist = haversineDistanceMiles(path[i - 1], path[i])
    const prev = accumulated
    accumulated += segDist
    while (nextSample <= accumulated) {
      const t = (nextSample - prev) / segDist
      points.push({
        lat: path[i - 1].lat + t * (path[i].lat - path[i - 1].lat),
        lng: path[i - 1].lng + t * (path[i].lng - path[i - 1].lng),
      })
      nextSample += intervalMiles
    }
  }
  if (points.length === 0) points.push(path[Math.floor(path.length / 2)])
  return points.slice(0, 6)
}

function formatDriveTime(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

async function fetchPlacesAtPoint(
  midpoint: LatLng,
  types: string[],
  apiKey: string
): Promise<ApiPlace[]> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location," +
        "places.rating,places.userRatingCount,places.photos,places.types,places.primaryType",
    },
    body: JSON.stringify({
      locationRestriction: {
        circle: {
          center: { latitude: midpoint.lat, longitude: midpoint.lng },
          radius: 40233.6, // 25 miles in meters
        },
      },
      includedTypes: types,
      maxResultCount: 10,
    }),
  })
  if (!res.ok) return []
  const data = await res.json() as { places?: ApiPlace[] }
  return data.places ?? []
}

function toPlace(raw: ApiPlace, startLatLng: LatLng, apiKey: string): Place {
  const lat = raw.location?.latitude ?? 0
  const lng = raw.location?.longitude ?? 0
  const distMiles = haversineDistanceMiles(startLatLng, { lat, lng })
  return {
    id: raw.id,
    name: raw.displayName?.text ?? "Unknown Place",
    address: raw.formattedAddress ?? "",
    latLng: { lat, lng },
    rating: raw.rating ?? 0,
    totalRatings: raw.userRatingCount ?? 0,
    photoUrl: raw.photos?.[0]
      ? `https://places.googleapis.com/v1/${raw.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`
      : null,
    types: raw.types ?? [],
    distanceFromStart: Math.round(distMiles * 10) / 10,
    driveTimeFromStart: formatDriveTime(distMiles / 55),
  }
}

// --- Component ---

export default function RoutePolyline({ startLatLng, endLatLng, fetchPlaces = true }: RoutePolylineProps) {
  const map = useMap()
  const mapsLib = useMapsLibrary("maps")
  const coreLib = useMapsLibrary("core")
  const { state, dispatch } = useTripPlan()

  useEffect(() => {
    if (!map || !mapsLib || !coreLib) return

    let cancelled = false
    let polyline: google.maps.Polyline | null = null

    const run = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string

      // --- Fetch route polyline ---
      const res = await fetch(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "routes.polyline,routes.legs",
          },
          body: JSON.stringify({
            origin: { location: { latLng: { latitude: startLatLng.lat, longitude: startLatLng.lng } } },
            destination: { location: { latLng: { latitude: endLatLng.lat, longitude: endLatLng.lng } } },
            travelMode: "DRIVE",
            polylineQuality: "HIGH_QUALITY",
          }),
        }
      )

      if (!res.ok || cancelled) return

      const data = await res.json() as {
        routes?: {
          polyline: { encodedPolyline: string }
          legs?: { distanceMeters?: number; duration?: string }[]
        }[]
      }
      if (cancelled || !data.routes?.[0]?.polyline?.encodedPolyline) return

      const route = data.routes[0]
      const path = decodePolyline(route.polyline.encodedPolyline)
      if (cancelled) return

      // Dispatch route stats (distance + drive time from API)
      const totalMeters = route.legs?.reduce((sum, leg) => sum + (leg.distanceMeters ?? 0), 0) ?? 0
      const totalSeconds = route.legs?.reduce((sum, leg) => {
        return sum + parseInt((leg.duration ?? "0s").replace("s", ""), 10)
      }, 0) ?? 0
      if (totalMeters > 0) {
        dispatch({
          type: "SET_ROUTE_STATS",
          payload: {
            distanceMiles: Math.round(totalMeters * 0.000621371 * 10) / 10,
            driveTime: formatDriveTime(totalSeconds / 3600),
          },
        })
      }

      // --- Draw polyline ---
      polyline = new mapsLib.Polyline({
        path,
        strokeColor: "#1a6b6b",
        strokeWeight: 5,
        strokeOpacity: 0.85,
        map,
      })

      const bounds = new coreLib.LatLngBounds()
      path.forEach((pt) => bounds.extend(pt))
      map.fitBounds(bounds, 40)

      // --- Fetch places along route ---
      if (!fetchPlaces || cancelled) return
      const types = [...new Set(
        state.selectedInterests.flatMap((id) => INTEREST_TYPE_MAP[id] ?? [])
      )]
      if (types.length === 0) return

      const midpoints = sampleMidpoints(path, 50)
      const allRaw = await Promise.all(
        midpoints.map((mp) => fetchPlacesAtPoint(mp, types, apiKey))
      )
      if (cancelled) return

      const seen = new Map<string, Place>()
      for (const raw of allRaw.flat()) {
        if (!seen.has(raw.id)) seen.set(raw.id, toPlace(raw, startLatLng, apiKey))
      }
      const places = [...seen.values()].sort((a, b) => b.rating - a.rating)
      dispatch({ type: "SET_AVAILABLE_STOPS", payload: places })
    }

    run().catch(console.error)

    return () => {
      cancelled = true
      polyline?.setMap(null)
    }
  }, [map, mapsLib, coreLib, startLatLng, endLatLng, state.selectedInterests, dispatch])

  return null
}
