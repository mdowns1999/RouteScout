import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Box,
  Chip,
  Container,
  type SvgIconProps,
} from "@mui/material"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import NatureIcon from "@mui/icons-material/Nature"
import MuseumIcon from "@mui/icons-material/Museum"
import TerrainIcon from "@mui/icons-material/Terrain"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import PaletteIcon from "@mui/icons-material/Palette"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import StarIcon from "@mui/icons-material/Star"
import PlaceIcon from "@mui/icons-material/Place"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import { useTripPlan } from "../../contexts/TripPlanContext"
import type { ComponentType } from "react"

const categories: {
  id: string
  title: string
  description: string
  Icon: ComponentType<SvgIconProps>
}[] = [
  { id: "food",        title: "Food & Dining",        description: "Local restaurants, food trucks, breweries",    Icon: RestaurantIcon },
  { id: "nature",      title: "Nature & Outdoors",    description: "Parks, hiking trails, scenic viewpoints",      Icon: NatureIcon },
  { id: "history",     title: "History & Culture",    description: "Museums, historical sites, landmarks",         Icon: MuseumIcon },
  { id: "adventure",   title: "Adventure Sports",     description: "Hiking, climbing, water sports",               Icon: TerrainIcon },
  { id: "photography", title: "Photography Spots",    description: "Scenic views, Instagram-worthy locations",     Icon: CameraAltIcon },
  { id: "arts",        title: "Arts & Entertainment", description: "Galleries, theaters, art districts",           Icon: PaletteIcon },
  { id: "music",       title: "Music & Nightlife",    description: "Live music venues, bars, clubs",               Icon: MusicNoteIcon },
  { id: "shopping",    title: "Shopping",             description: "Local markets, unique stores, outlets",        Icon: ShoppingBagIcon },
  { id: "attractions", title: "Tourist Attractions",  description: "Famous landmarks, theme parks",                Icon: StarIcon },
  { id: "hidden",      title: "Hidden Gems",          description: "Off-the-beaten-path discoveries",              Icon: PlaceIcon },
]

export default function InterestsView() {
  const { state, dispatch } = useTripPlan()
  const selected = state.selectedInterests

  const handleSelect = (catId: string) => {
    const newInterests = selected.includes(catId)
      ? selected.filter((id) => id !== catId)
      : [...selected, catId]
    dispatch({ type: "SET_SELECTED_INTERESTS", payload: newInterests })
  }

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Heading level="h1" size="h4" centered>
          What Interests You?
        </Heading>
        <Paragraph size="sm" centered>
          Select the categories that match your interests — we'll suggest stops along your route.
        </Paragraph>
      </Box>

      <Grid container spacing={2}>
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.id)
          return (
            <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: isSelected ? "secondary.main" : "background.paper",
                  borderColor: isSelected ? "secondary.main" : undefined,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: isSelected ? "secondary.dark" : "action.hover",
                  },
                }}
              >
                <CardActionArea onClick={() => handleSelect(cat.id)} sx={{ height: "100%" }}>
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Box sx={{ mb: 1.5 }}>
                      <cat.Icon
                        sx={{
                          fontSize: 40,
                          color: isSelected ? "secondary.contrastText" : "secondary.main",
                        }}
                      />
                    </Box>
                    <Heading
                      level="h3"
                      size="h6"
                      sx={{ color: isSelected ? "secondary.contrastText" : "inherit", mb: 0.5 }}
                    >
                      {cat.title}
                    </Heading>
                    <Paragraph
                      size="xs"
                      sx={{ color: isSelected ? "rgba(255,255,255,0.85)" : "text.secondary" }}
                    >
                      {cat.description}
                    </Paragraph>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {selected.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Chip
            label={`${selected.length} ${selected.length === 1 ? "category" : "categories"} selected`}
            sx={{ bgcolor: "secondary.main", color: "white", fontWeight: 600 }}
          />
        </Box>
      )}
    </Container>
  )
}
