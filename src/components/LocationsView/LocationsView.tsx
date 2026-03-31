import {
  Card,
  CardContent,
  Stack,
  TextField,
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

export default function LocationsView() {
  const { state, dispatch } = useTripPlan()

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
                <TextField
                  fullWidth
                  label="Starting Point"
                  variant="outlined"
                  placeholder="City, state or address"
                  value={state.startLocation}
                  onChange={(e) => dispatch({ type: "SET_STARTING_POINT", payload: e.target.value })}
                  required
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
                <TextField
                  fullWidth
                  label="Destination"
                  variant="outlined"
                  placeholder="City, state or address"
                  value={state.endLocation}
                  onChange={(e) => dispatch({ type: "SET_DESTINATION", payload: e.target.value })}
                  required
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
                  <InputLabel id="duration-label">Trip Duration</InputLabel>
                  <Select
                    labelId="duration-label"
                    label="Trip Duration"
                    value={state.duration}
                    onChange={(e) => dispatch({ type: "SET_DURATION", payload: e.target.value })}
                  >
                    <MenuItem value="1">1 Day</MenuItem>
                    <MenuItem value="2-3">2–3 Days</MenuItem>
                    <MenuItem value="4-7">4–7 Days</MenuItem>
                    <MenuItem value="7+">7+ Days</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="pace-label">Travel Pace</InputLabel>
                  <Select
                    labelId="pace-label"
                    label="Travel Pace"
                    value={state.travelPace}
                    onChange={(e) => dispatch({ type: "SET_PACE", payload: e.target.value })}
                  >
                    <MenuItem value="relaxed">Relaxed</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="fast">Fast-Paced</MenuItem>
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
