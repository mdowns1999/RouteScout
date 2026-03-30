import { Alert, Box, Button, Chip, CircularProgress, Container, LinearProgress, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Paragraph from "../../components/UI/Paragraph/Paragraph"
import useIsMobile from "../../hooks/useIsMobile"
import { useState } from "react"
import LocationsView from "../../components/LocationsView/LocationsView"
import InterestsView from "../../components/InterestsView/InterestsView"
import SuggestedStops from "../../components/SuggestedStops/SuggestedStops"
import TripSummary from "../../components/TripSummary/TripSummary"
import { useTripPlan } from "../../contexts/TripPlanContext"

interface ProgressLabelProps {
  number: string
  label: string
  isMobile?: boolean
  filled?: boolean
}

const ProgressLabel: React.FC<ProgressLabelProps> = ({
  number,
  label,
  isMobile = true,
  filled = false,
}) => (
  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
    <Chip
      label={number}
      size="small"
      color={filled ? "secondary" : "primary"}
      variant={filled ? "filled" : "outlined"}
    />
    {!isMobile && <Paragraph size="xs">{label}</Paragraph>}
  </Stack>
)

const steps = [
  { number: "1", label: "Locations",  progress: 25,  nextLabel: "Continue to Interests",       prevLabel: null },
  { number: "2", label: "Interests",  progress: 50,  nextLabel: "Continue to Suggested Stops", prevLabel: "Back to Locations" },
  { number: "3", label: "Stops",      progress: 75,  nextLabel: "Continue to Trip Summary",    prevLabel: "Back to Interests" },
  { number: "4", label: "Summary",    progress: 100, nextLabel: "Export Your Trip",            prevLabel: "Back to Suggested Stops" },
]

const stepComponents = [
  <LocationsView />,
  <InterestsView />,
  <SuggestedStops />,
  <TripSummary />,
]

export default function TripPage() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const { state, dispatch, isStep1Valid, isStep2Valid, isStep3Valid } = useTripPlan()
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState<string | null>(null)

  const isCurrentStepValid = () => {
    switch (progress) {
      case 0: return isStep1Valid()
      case 1: return isStep2Valid()
      case 2: return isStep3Valid()
      default: return true
    }
  }

  const handleNext = async () => {
    setGeocodeError(null)
    if (progress === 0) {
      setIsGeocoding(true)
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
        const enc = encodeURIComponent
        const [startRes, endRes] = await Promise.all([
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${enc(state.startLocation)}&key=${apiKey}`).then((r) => r.json()),
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${enc(state.endLocation)}&key=${apiKey}`).then((r) => r.json()),
        ])
        if (startRes.status !== "OK") {
          setGeocodeError(`Could not find "${state.startLocation}". Please check the address and try again.`)
          return
        }
        if (endRes.status !== "OK") {
          setGeocodeError(`Could not find "${state.endLocation}". Please check the address and try again.`)
          return
        }
        dispatch({ type: "SET_START_LATLNG", payload: startRes.results[0].geometry.location })
        dispatch({ type: "SET_END_LATLNG", payload: endRes.results[0].geometry.location })
        setProgress(progress + 1)
      } catch {
        setGeocodeError("Failed to look up locations. Please check your connection and try again.")
      } finally {
        setIsGeocoding(false)
      }
    } else {
      setProgress(progress + 1)
    }
  }

  const hasPrevious = progress > 0
  const step = steps[progress]

  return (
    <>
      {/* Sticky progress bar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          bgcolor: "background.default",
          borderBottom: 1,
          borderColor: "divider",
          py: 1.5,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
            <Paragraph size="xs" sx={{ color: "text.secondary" }}>
              Step {step.number} of {steps.length}
            </Paragraph>
            <Paragraph size="xs" sx={{ color: "text.secondary" }}>
              {step.progress}%
            </Paragraph>
          </Stack>
          <LinearProgress
            sx={{ height: 6, borderRadius: 3, mb: 1 }}
            variant="determinate"
            value={step.progress}
            color="secondary"
          />
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            {steps.map((s, i) => (
              <ProgressLabel
                key={s.number}
                number={s.number}
                label={s.label}
                isMobile={isMobile}
                filled={i === progress}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Step content */}
      {stepComponents[progress]}

      {/* Nav buttons */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 4 }}>
        {geocodeError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setGeocodeError(null)}>
            {geocodeError}
          </Alert>
        )}
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          sx={{ justifyContent: hasPrevious ? "space-between" : "flex-end", gap: 1 }}
        >
          {hasPrevious && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setProgress(progress - 1)}
            >
              {step.prevLabel}
            </Button>
          )}
          {progress < steps.length - 1 ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNext}
              disabled={!isCurrentStepValid() || isGeocoding}
              startIcon={isGeocoding ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {isGeocoding ? "Looking up locations…" : step.nextLabel}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/trip/export")}
              disabled={!isCurrentStepValid()}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {step.nextLabel}
            </Button>
          )}
        </Stack>
      </Container>
    </>
  )
}
