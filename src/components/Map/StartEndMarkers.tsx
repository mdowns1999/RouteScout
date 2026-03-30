import { AdvancedMarker } from "@vis.gl/react-google-maps"
import { Box } from "@mui/material"
import { useTripPlan } from "../../contexts/TripPlanContext"

export default function StartEndMarkers() {
  const { state } = useTripPlan()
  const { startLatLng, endLatLng } = state

  return (
    <>
      {startLatLng && (
        <AdvancedMarker position={startLatLng}>
          <Box
            sx={{
              bgcolor: "#3f7d58",
              color: "#fff",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            Start
          </Box>
        </AdvancedMarker>
      )}
      {endLatLng && (
        <AdvancedMarker position={endLatLng}>
          <Box
            sx={{
              bgcolor: "#d6594d",
              color: "#fff",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            End
          </Box>
        </AdvancedMarker>
      )}
    </>
  )
}
