import {
  Card,
  CardContent,
  Stack,
  TextField,
  Autocomplete,
  Grid,
  Box,
  IconButton,
  Container,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SwapVertIcon from "@mui/icons-material/SwapVert"
import ExploreIcon from "@mui/icons-material/Explore"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import { useTripPlan } from "../../contexts/TripPlanContext"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { useRef, useState, useCallback } from "react"

const BUDGET_STEPS = ["0-50", "50-100", "100-200", "200+"] as const
const BUDGET_LABELS = ["$", "$$", "$$$", "$$$$"]
const BUDGET_DESCRIPTIONS = ["$0–$50 / day", "$50–$100 / day", "$100–$200 / day", "$200+ / day"]

export default function LocationsView() {
  const { state, dispatch } = useTripPlan()
  const placesLib = useMapsLibrary("places")
  const [startOptions, setStartOptions] = useState<string[]>([])
  const [endOptions, setEndOptions] = useState<string[]>([])
  const startToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const endToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSuggestions = useCallback((
    input: string,
    tokenRef: React.MutableRefObject<google.maps.places.AutocompleteSessionToken | null>,
    setOptions: (opts: string[]) => void,
  ) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (!placesLib || input.length < 2) { setOptions([]); return }
    debounceTimer.current = setTimeout(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AutocompleteSuggestion = (placesLib as any).AutocompleteSuggestion
      if (!AutocompleteSuggestion) return
      if (!tokenRef.current) tokenRef.current = new placesLib.AutocompleteSessionToken()
      try {
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: tokenRef.current,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOptions(suggestions.map((s: any) => s.placePrediction.text.toString()))
      } catch { setOptions([]) }
    }, 350)
  }, [placesLib])

  const budgetIndex = BUDGET_STEPS.indexOf(state.budget as typeof BUDGET_STEPS[number])
  const radiusValue = parseInt(state.searchRadius, 10)

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      {/* Hero */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Box
          sx={{
            bgcolor: "secondary.main",
            borderRadius: "50%",
            p: 1.5,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ExploreIcon sx={{ fontSize: 36, color: "white" }} />
        </Box>
        <Heading level="h1" size="h4" centered>
          Plan your Road Trip
        </Heading>
        <Paragraph size="sm" centered>
          Set your start and destination — we'll find amazing stops along the way.
        </Paragraph>
      </Box>

      <Grid container spacing={3}>
        {/* Route Details — 60% */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <LocationOnIcon color="primary" />
                <Heading level="h2" size="h5">Route Details</Heading>
              </Stack>
              <Stack spacing={2}>
                <Autocomplete
                  freeSolo
                  options={startOptions}
                  inputValue={state.startLocation}
                  onInputChange={(_, value) => {
                    dispatch({ type: "SET_STARTING_POINT", payload: value })
                    fetchSuggestions(value, startToken, setStartOptions)
                  }}
                  onChange={(_, value) => {
                    if (value) {
                      dispatch({ type: "SET_STARTING_POINT", payload: value as string })
                      startToken.current = null
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label="Starting Point" variant="outlined" placeholder="City, state or address" required />
                  )}
                />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <IconButton
                    size="small"
                    aria-label="swap locations"
                    onClick={() => dispatch({ type: "SWAP_LOCATIONS" })}
                  >
                    <SwapVertIcon />
                  </IconButton>
                </Box>
                <Autocomplete
                  freeSolo
                  options={endOptions}
                  inputValue={state.endLocation}
                  onInputChange={(_, value) => {
                    dispatch({ type: "SET_DESTINATION", payload: value })
                    fetchSuggestions(value, endToken, setEndOptions)
                  }}
                  onChange={(_, value) => {
                    if (value) {
                      dispatch({ type: "SET_DESTINATION", payload: value as string })
                      endToken.current = null
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label="Destination" variant="outlined" placeholder="City, state or address" required />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Travel Preferences — 40% */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%", padding: 2 }}>
            <CardContent>
              <Heading level="h2" size="h5" sx={{ mb: 2 }}>
                Travel Preferences
              </Heading>
              <Stack spacing={3}>

                {/* Budget */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                    <Paragraph size="sm" sx={{ fontWeight: 600 }}>Budget</Paragraph>
                    <Paragraph size="xs" sx={{ color: "text.secondary" }}>
                      {BUDGET_LABELS[budgetIndex]} · {BUDGET_DESCRIPTIONS[budgetIndex]}
                    </Paragraph>
                  </Box>
                  <Slider
                    min={0}
                    max={3}
                    step={1}
                    value={budgetIndex}
                    onChange={(_, v) => dispatch({ type: "SET_BUDGET", payload: BUDGET_STEPS[v as number] })}
                    marks={BUDGET_LABELS.map((label, i) => ({ value: i, label }))}
                    color="secondary"
                    sx={{ mt: 1 }}
                  />
                </Box>

                {/* Distance from Route */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                    <Paragraph size="sm" sx={{ fontWeight: 600 }}>Distance from Route</Paragraph>
                    <Paragraph size="xs" sx={{ color: "text.secondary" }}>
                      Within {radiusValue} miles
                    </Paragraph>
                  </Box>
                  <Slider
                    min={5}
                    max={25}
                    step={5}
                    value={radiusValue}
                    onChange={(_, v) => dispatch({ type: "SET_SEARCH_RADIUS", payload: String(v) })}
                    marks={[
                      { value: 5, label: "5 mi" },
                      { value: 15, label: "15 mi" },
                      { value: 25, label: "25 mi" },
                    ]}
                    color="secondary"
                    sx={{ mt: 1 }}
                  />
                </Box>

                {/* Prioritize By */}
                <Box>
                  <Paragraph size="sm" sx={{ fontWeight: 600, mb: 1 }}>Prioritize Stops By</Paragraph>
                  <ToggleButtonGroup
                    value={state.rankPreference}
                    exclusive
                    onChange={(_, v) => v && dispatch({ type: "SET_RANK_PREFERENCE", payload: v })}
                    fullWidth
                    size="small"
                  >
                    <ToggleButton value="POPULARITY">Top Rated</ToggleButton>
                    <ToggleButton value="DISTANCE">Closest to Route</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
