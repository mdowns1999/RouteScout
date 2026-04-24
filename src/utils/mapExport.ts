import type { Place } from "../contexts/TripPlanContext"

const enc = encodeURIComponent

export function buildGoogleMapsUrl(
  startLocation: string,
  endLocation: string,
  stops: Place[],
  useAppScheme = false
): string {
  // On iOS, comgooglemapsurl:// opens the Google Maps app directly, which supports multi-stop routes
  const base = useAppScheme
    ? "comgooglemapsurl://www.google.com/maps/dir/?api=1"
    : "https://www.google.com/maps/dir/?api=1"
  const waypoints = stops.map((s) => `${s.latLng.lat},${s.latLng.lng}`).join("|")
  return (
    base +
    `&origin=${enc(startLocation)}` +
    `&destination=${enc(endLocation)}` +
    (waypoints ? `&waypoints=${enc(waypoints)}` : "") +
    `&travelmode=driving`
  )
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function buildAppleMapsUrl(startLocation: string, endLocation: string, _stops: Place[]): string {
  // Apple Maps URL scheme doesn't support intermediate waypoints — start and end only
  return `https://maps.apple.com/?saddr=${enc(startLocation)}&daddr=${enc(endLocation)}`
}

export function buildGpxBlob(
  startLocation: string,
  endLocation: string,
  stops: Place[]
): Blob {
  const tripName = `${startLocation} to ${endLocation}`
  const waypoints = stops
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
    waypoints + "\n" +
    `  </rte>\n` +
    `</gpx>`
  return new Blob([gpx], { type: "application/gpx+xml" })
}
