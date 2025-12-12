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
  IconButton
} from "@mui/material"
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import LayoutBand from "../UI/Layoutband/LayoutBand"

export default function LocationsView() {
  return (
    <LayoutBand spacing="lg">
      <Heading level='h1' size='h2' centered>
        Plan your Roadtrip
      </Heading>
      <Paragraph centered>
        Let's start by setting your starting point and destination. We'll help you discover amazing stops along the way.
      </Paragraph>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Location Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <LocationOnIcon color="primary" />
                <Heading level='h2' size='h5'>Route Details</Heading>
              </Stack>
              
              <Stack spacing={2}>
                <TextField 
                  fullWidth
                  label="Starting Point" 
                  variant="outlined"
                  placeholder="Enter your starting location"
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton size="small" aria-label="swap locations">
                    <SwapVertIcon />
                  </IconButton>
                </Box>
                
                <TextField 
                  fullWidth
                  label="Destination" 
                  variant="outlined"
                  placeholder="Enter your destination"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2} >
            <CardContent>
              <Heading level='h2' size='h5' sx={{ mb: 2 }}>
                Travel Preferences
              </Heading>
              
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category-select"
                    label="Category"
                    defaultValue=""
                  >
                    <MenuItem value="food">Food & Dining</MenuItem>
                    <MenuItem value="nature">Nature & Parks</MenuItem>
                    <MenuItem value="history">History & Culture</MenuItem>
                    <MenuItem value="adventure">Adventure</MenuItem>
                    <MenuItem value="shopping">Shopping</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="duration-label">Trip Duration</InputLabel>
                  <Select
                    labelId="duration-label"
                    id="duration-select"
                    label="Trip Duration"
                    defaultValue=""
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
                    defaultValue=""
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