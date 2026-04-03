import { useState } from "react"
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps"
import { Box, Button, Rating } from "@mui/material"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import LocalCafeIcon from "@mui/icons-material/LocalCafe"
import BakeryDiningIcon from "@mui/icons-material/BakeryDining"
import LocalBarIcon from "@mui/icons-material/LocalBar"
import ParkIcon from "@mui/icons-material/Park"
import NaturePeopleIcon from "@mui/icons-material/NaturePeople"
import MuseumIcon from "@mui/icons-material/Museum"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import ColorLensIcon from "@mui/icons-material/ColorLens"
import SportsIcon from "@mui/icons-material/Sports"
import LocalMallIcon from "@mui/icons-material/LocalMall"
import StorefrontIcon from "@mui/icons-material/Storefront"
import AttractionsIcon from "@mui/icons-material/Attractions"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PlaceIcon from "@mui/icons-material/Place"
import PhoneIcon from "@mui/icons-material/Phone"
import type { SvgIconProps } from "@mui/material"
import { useTripPlan, type Place } from "../../contexts/TripPlanContext"
import Paragraph from "../UI/Paragraph/Paragraph"

const TYPE_ICONS: Record<string, React.ComponentType<SvgIconProps>> = {
  restaurant:              RestaurantIcon,
  cafe:                    LocalCafeIcon,
  bakery:                  BakeryDiningIcon,
  bar:                     LocalBarIcon,
  park:                    ParkIcon,
  campground:              NaturePeopleIcon,
  national_park:           ParkIcon,
  hiking_area:             NaturePeopleIcon,
  museum:                  MuseumIcon,
  historical_landmark:     AccountBalanceIcon,
  art_gallery:             ColorLensIcon,
  performing_arts_theater: ColorLensIcon,
  sports_complex:          SportsIcon,
  climbing_gym:            SportsIcon,
  shopping_mall:           LocalMallIcon,
  market:                  StorefrontIcon,
  store:                   StorefrontIcon,
  tourist_attraction:      AttractionsIcon,
  amusement_park:          AttractionsIcon,
  night_club:              MusicNoteIcon,
  scenic_viewpoint:        NaturePeopleIcon,
  botanical_garden:        ParkIcon,
  visitor_center:          LocationOnIcon,
}

function getIcon(types: string[]): React.ComponentType<SvgIconProps> {
  for (const t of types) {
    if (TYPE_ICONS[t]) return TYPE_ICONS[t]
  }
  return LocationOnIcon
}

export default function StopMarkers() {
  const { state, dispatch } = useTripPlan()
  const { availableStops, selectedStops } = state
  const [openStopId, setOpenStopId] = useState<string | null>(null)

  const openStop = openStopId
    ? availableStops.find((s) => s.id === openStopId) ?? null
    : null

  const toggleStop = (stop: Place) => {
    const isSelected = selectedStops.some((s) => s.id === stop.id)
    dispatch({
      type: "SET_SELECTED_STOPS",
      payload: isSelected
        ? selectedStops.filter((s) => s.id !== stop.id)
        : [...selectedStops, stop],
    })
  }

  return (
    <>
      {availableStops.map((stop) => {
        const isSelected = selectedStops.some((s) => s.id === stop.id)
        const Icon = getIcon(stop.types)
        return (
          <AdvancedMarker
            key={stop.id}
            position={stop.latLng}
            onClick={() => setOpenStopId(stop.id === openStopId ? null : stop.id)}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: isSelected ? "#f4b942" : "rgba(26,107,107,0.45)",
                border: isSelected ? "2px solid #f4b942" : "1.5px solid #1a6b6b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: isSelected ? "0 2px 8px rgba(244,185,66,0.5)" : "none",
                transition: "all 0.15s",
              }}
            >
              <Icon sx={{ color: isSelected ? "#333" : "#fff", fontSize: 18 }} />
            </Box>
          </AdvancedMarker>
        )
      })}

      {openStop && (
        <InfoWindow
          position={openStop.latLng}
          pixelOffset={[0, -40]}
          onCloseClick={() => setOpenStopId(null)}
        >
          <Box sx={{ maxWidth: 260, p: 0.5 }}>
            {openStop.photoUrl && (
              <Box
                component="img"
                src={openStop.photoUrl}
                alt={openStop.name}
                sx={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 1, mb: 1 }}
              />
            )}

            {/* Name as Google Maps link */}
            <Box component="a"
              href={openStop.mapsUrl ?? `https://maps.google.com/?q=${encodeURIComponent(openStop.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              <Paragraph size="sm" sx={{ fontWeight: "bold", mb: 0.25, color: "primary.main" }}>
                {openStop.name}
              </Paragraph>
            </Box>

            {/* Description */}
            {openStop.description && (
              <Paragraph size="xs" sx={{ mb: 0.75, fontStyle: "italic", color: "text.secondary" }}>
                {openStop.description}
              </Paragraph>
            )}

            {/* Address */}
            {openStop.address && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mb: 0.25 }}>
                <PlaceIcon sx={{ fontSize: 13, color: "text.secondary", mt: "2px", flexShrink: 0 }} />
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>{openStop.address}</Paragraph>
              </Box>
            )}

            {/* Phone */}
            {openStop.phone && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75 }}>
                <PhoneIcon sx={{ fontSize: 13, color: "text.secondary", flexShrink: 0 }} />
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>{openStop.phone}</Paragraph>
              </Box>
            )}

            {/* Rating */}
            {openStop.rating > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, mt: 0.5 }}>
                <Rating value={openStop.rating} precision={0.1} size="small" readOnly />
                <Paragraph size="xs">({openStop.totalRatings})</Paragraph>
              </Box>
            )}

            <Button
              variant={selectedStops.some((s) => s.id === openStop.id) ? "outlined" : "contained"}
              color="secondary"
              size="small"
              fullWidth
              onClick={() => toggleStop(openStop)}
            >
              {selectedStops.some((s) => s.id === openStop.id) ? "Remove Stop" : "Add Stop"}
            </Button>
          </Box>
        </InfoWindow>
      )}
    </>
  )
}
