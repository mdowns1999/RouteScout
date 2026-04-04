import {
  Card,
  CardContent,
  Stack,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  IconButton,
  Container,
} from "@mui/material"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SwapVertIcon from "@mui/icons-material/SwapVert"
import ExploreIcon from "@mui/icons-material/Explore"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import { useTripPlan } from "../../contexts/TripPlanContext"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { useRef, useState, useCallback } from "react"

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
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Heading level="h2" size="h5" sx={{ mb: 2 }}>
                Travel Preferences
              </Heading>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="budget-label">Budget</InputLabel>
                  <Select
                    labelId="budget-label"
                    label="Budget"
                    value={state.budget}
                    onChange={(e) => dispatch({ type: "SET_BUDGET", payload: e.target.value })}
                  >
                    <MenuItem value="0-50">$0–$50 / day</MenuItem>
                    <MenuItem value="50-100">$50–$100 / day</MenuItem>
                    <MenuItem value="100-200">$100–$200 / day</MenuItem>
                    <MenuItem value="200+">$200+ / day</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="rank-label">Prioritize Stops By</InputLabel>
                  <Select
                    labelId="rank-label"
                    label="Prioritize Stops By"
                    value={state.rankPreference}
                    onChange={(e) => dispatch({ type: "SET_RANK_PREFERENCE", payload: e.target.value })}
                  >
                    <MenuItem value="POPULARITY">Top Rated</MenuItem>
                    <MenuItem value="DISTANCE">Closest to Route</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="radius-label">Distance from Route</InputLabel>
                  <Select
                    labelId="radius-label"
                    label="Distance from Route"
                    value={state.searchRadius}
                    onChange={(e) => dispatch({ type: "SET_SEARCH_RADIUS", payload: e.target.value })}
                  >
                    <MenuItem value="5">Within 5 miles</MenuItem>
                    <MenuItem value="10">Within 10 miles</MenuItem>
                    <MenuItem value="25">Within 25 miles</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
