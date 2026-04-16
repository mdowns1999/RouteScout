import type { ComponentType } from "react"
import type { SvgIconProps } from "@mui/material"
import LocalCafeIcon from "@mui/icons-material/LocalCafe"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import SportsBarIcon from "@mui/icons-material/SportsBar"
import StorefrontIcon from "@mui/icons-material/Storefront"
import HikingIcon from "@mui/icons-material/Hiking"
import LandscapeIcon from "@mui/icons-material/Landscape"
import CabinIcon from "@mui/icons-material/Cabin"
import BeachAccessIcon from "@mui/icons-material/BeachAccess"
import MuseumIcon from "@mui/icons-material/Museum"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import PaletteIcon from "@mui/icons-material/Palette"
import TerrainIcon from "@mui/icons-material/Terrain"
import StarIcon from "@mui/icons-material/Star"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import ExploreIcon from "@mui/icons-material/Explore"

export interface Category {
  id: string
  title: string
  subtitle: string
  Icon: ComponentType<SvgIconProps>
}

export const CATEGORIES: Category[] = [
  // Nature & outdoors — the heart of any road trip
  { id: "parks_trails",       title: "Parks & Trails",          subtitle: "Hiking, walking paths",                 Icon: HikingIcon },
  { id: "scenic_viewpoints",  title: "Scenic Viewpoints",       subtitle: "Overlooks, photo spots",                Icon: LandscapeIcon },
  { id: "beaches_lakes",      title: "Beaches & Lakes",         subtitle: "Swimming, waterfront",                  Icon: BeachAccessIcon },
  { id: "hidden_gems",        title: "Hidden Gems",             subtitle: "Off-the-beaten-path stops",             Icon: ExploreIcon },
  // Food & drink — essential on every trip
  { id: "restaurants",        title: "Restaurants",             subtitle: "Sit-down dining, local eats",           Icon: RestaurantIcon },
  { id: "coffee_cafes",       title: "Coffee & Cafes",          subtitle: "Espresso bars, local roasters",         Icon: LocalCafeIcon },
  { id: "breweries_wineries", title: "Breweries & Wineries",    subtitle: "Craft beer, wine tasting",              Icon: SportsBarIcon },
  { id: "food_markets",       title: "Food Markets & Trucks",   subtitle: "Street food, farmers markets",          Icon: StorefrontIcon },
  // Culture & history
  { id: "historic_landmarks", title: "Historic Landmarks",      subtitle: "Monuments, heritage sites",             Icon: AccountBalanceIcon },
  { id: "museums_history",    title: "Museums & History",       subtitle: "Cultural sites, exhibits",              Icon: MuseumIcon },
  { id: "art_galleries",      title: "Art & Galleries",         subtitle: "Local art, galleries",                  Icon: PaletteIcon },
  // Activities & overnight
  { id: "adventure_sports",   title: "Adventure & Sports",      subtitle: "Climbing, skiing, water sports",        Icon: TerrainIcon },
  { id: "camping_rv",         title: "Camping & RV Parks",      subtitle: "Campgrounds, RV hookups",               Icon: CabinIcon },
  // Shopping & entertainment
  { id: "local_shops",        title: "Local Markets & Shops",   subtitle: "Boutiques, unique finds",               Icon: ShoppingBagIcon },
  { id: "theme_parks",        title: "Amusement & Theme Parks", subtitle: "Rides, family attractions",             Icon: StarIcon },
]

export const INTEREST_TYPE_MAP: Record<string, string[]> = {
  coffee_cafes:       ["cafe", "coffee_shop"],
  restaurants:        ["restaurant"],
  breweries_wineries: ["bar", "winery", "brewery"],
  food_markets:       ["bakery", "market", "food_court"],
  parks_trails:       ["park", "hiking_area", "national_park"],
  scenic_viewpoints:  ["tourist_attraction", "national_park"],
  camping_rv:         ["campground", "rv_park"],
  beaches_lakes:      ["beach", "lake"],
  museums_history:    ["museum", "historical_landmark"],
  historic_landmarks: ["historical_landmark"],
  art_galleries:      ["art_gallery"],
  adventure_sports:   ["sports_complex", "climbing_gym", "ski_resort"],
  theme_parks:        ["amusement_park", "tourist_attraction"],
  local_shops:        ["shopping_mall", "store", "market"],
  hidden_gems:        ["observation_deck", "botanical_garden", "wildlife_park", "visitor_center"],
}
