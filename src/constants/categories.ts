import type { ComponentType } from "react"
import type { SvgIconProps } from "@mui/material"
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

export interface Category {
  id: string
  title: string
  description: string
  Icon: ComponentType<SvgIconProps>
}

export const CATEGORIES: Category[] = [
  { id: "food",        title: "Food & Dining",        description: "Local restaurants, food trucks, breweries",    Icon: RestaurantIcon },
  { id: "nature",      title: "Nature & Outdoors",    description: "Parks, hiking trails, scenic viewpoints",      Icon: NatureIcon },
  { id: "history",     title: "History & Culture",    description: "Museums, historical sites, landmarks",         Icon: MuseumIcon },
  { id: "adventure",   title: "Adventure Sports",     description: "Marinas, ski resorts, sports complexes",       Icon: TerrainIcon },
  { id: "photography", title: "Photography Spots",    description: "Scenic views, Instagram-worthy locations",     Icon: CameraAltIcon },
  { id: "arts",        title: "Arts & Entertainment", description: "Galleries, theaters, art districts",           Icon: PaletteIcon },
  { id: "music",       title: "Music & Nightlife",    description: "Live music venues, bars, clubs",               Icon: MusicNoteIcon },
  { id: "shopping",    title: "Shopping",             description: "Local markets, unique stores, outlets",        Icon: ShoppingBagIcon },
  { id: "attractions", title: "Tourist Attractions",  description: "Famous landmarks, theme parks",                Icon: StarIcon },
  { id: "hidden",      title: "Hidden Gems",          description: "Off-the-beaten-path discoveries",              Icon: PlaceIcon },
]

export const INTEREST_TYPE_MAP: Record<string, string[]> = {
  food:        ["restaurant", "cafe", "bakery", "bar"],
  nature:      ["park", "campground", "national_park", "hiking_area"],
  history:     ["museum", "historical_landmark", "art_gallery"],
  adventure:   ["sports_complex", "marina", "ski_resort"],
  photography: ["tourist_attraction", "observation_deck"],
  arts:        ["art_gallery", "performing_arts_theater"],
  music:       ["night_club", "bar"],
  shopping:    ["shopping_mall", "market", "store"],
  attractions: ["tourist_attraction", "amusement_park"],
  hidden:      ["botanical_garden", "visitor_center"],
}
