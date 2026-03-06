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
} from "@mui/material"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SwapVertIcon from "@mui/icons-material/SwapVert"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import LayoutBand from "../UI/Layoutband/LayoutBand"
import { useTripPlan } from "../../contexts/TripPlanContext"

export default function LocationsView() {
  const { state, dispatch } = useTripPlan()

  return (
    <LayoutBand>
      <Heading level="h1" size="h2" centered>
        Plan your Roadtrip
      </Heading>
      <Paragraph centered>
        Let's start by setting your starting point and destination. We'll help
        you discover amazing stops along the way.
      </Paragraph>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Location Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <LocationOnIcon color="primary" />
                <Heading level="h2" size="h5">
                  Route Details
                </Heading>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Starting Point"
                  variant="outlined"
                  placeholder="Enter your starting location"
                  value={state.startingPoint}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_STARTING_POINT",
                      payload: e.target.value,
                    })
                  }
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
                  placeholder="Enter your destination"
                  value={state.destination}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_DESTINATION",
                      payload: e.target.value,
                    })
                  }
                  required
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Heading level="h2" size="h5" sx={{ mb: 2 }}>
                Travel Preferences
              </Heading>

              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="budget-label">Budget</InputLabel>
                  <Select
                    labelId="budget-label"
                    id="budget-select"
                    label="Budget"
                    value={state.budget}
                    onChange={(e) =>
                      dispatch({ type: "SET_BUDGET", payload: e.target.value })
                    }
                  >
                    <MenuItem value="0-50">$0-$50</MenuItem>
                    <MenuItem value="50-100">$50-$100</MenuItem>
                    <MenuItem value="100-200">$100-$200</MenuItem>
                    <MenuItem value="200+">$200+</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="duration-label">Trip Duration</InputLabel>
                  <Select
                    labelId="duration-label"
                    id="duration-select"
                    label="Trip Duration"
                    value={state.duration}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_DURATION",
                        payload: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="1">1 Day</MenuItem>
                    <MenuItem value="2-3">2-3 Days</MenuItem>
                    <MenuItem value="4-7">4-7 Days</MenuItem>
                    <MenuItem value="7+">7+ Days</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="pace-label">Travel Pace</InputLabel>
                  <Select
                    labelId="pace-label"
                    id="pace-select"
                    label="Travel Pace"
                    value={state.pace}
                    onChange={(e) =>
                      dispatch({ type: "SET_PACE", payload: e.target.value })
                    }
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
    </LayoutBand>
  )
}
