import { type ReactNode } from "react"
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps"

interface MapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string | number
  children?: ReactNode
}

export default function Map({
  center = { lat: 37.7749, lng: -122.4194 },
  zoom = 9,
  height = "100%",
  children,
}: MapProps) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ height, width: "100%" }}>
        <GoogleMap
          defaultZoom={zoom}
          defaultCenter={center}
          gestureHandling="greedy"
          mapId="routescout"
        >
          {children}
        </GoogleMap>
      </div>
    </APIProvider>
  )
}
