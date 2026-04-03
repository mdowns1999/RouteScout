import { useState } from "react"
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps"
import { Box, Button } from "@mui/material"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { useTripPlan, type Place } from "../../contexts/TripPlanContext"
import Paragraph from "../UI/Paragraph/Paragraph"

export default function SelectedStopMarkers() {
  const { state, dispatch } = useTripPlan()
  const { selectedStops } = state
  const [openStopId, setOpenStopId] = useState<string | null>(null)

  const openStop = openStopId
    ? selectedStops.find((s) => s.id === openStopId) ?? null
    : null

  const removeStop = (stop: Place) => {
    dispatch({
      type: "SET_SELECTED_STOPS",
      payload: selectedStops.filter((s) => s.id !== stop.id),
    })
    setOpenStopId(null)
  }

  return (
    <>
      {selectedStops.map((stop) => (
        <AdvancedMarker
          key={stop.id}
          position={stop.latLng}
          onClick={() => setOpenStopId(stop.id === openStopId ? null : stop.id)}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "#f4b942",
              border: "2px solid #f4b942",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(244,185,66,0.5)",
            }}
          >
            <LocationOnIcon sx={{ color: "#333", fontSize: 18 }} />
          </Box>
        </AdvancedMarker>
      ))}

      {openStop && (
        <InfoWindow
          position={openStop.latLng}
          pixelOffset={[0, -40]}
          onCloseClick={() => setOpenStopId(null)}
        >
          <Box sx={{ maxWidth: 200, p: 0.5 }}>
            <Paragraph size="sm" sx={{ fontWeight: "bold", mb: 1 }}>
              {openStop.name}
            </Paragraph>
            <Button
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              onClick={() => removeStop(openStop)}
            >
              Remove Stop
            </Button>
          </Box>
        </InfoWindow>
      )}
    </>
  )
}
