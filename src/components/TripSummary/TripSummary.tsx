import {
  CardMedia,
  Card,
  Box,
  Stack,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Rating,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import PlaceIcon from "@mui/icons-material/Place"
import DeleteIcon from "@mui/icons-material/Delete"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import ViewListIcon from "@mui/icons-material/ViewList"
import MapIcon from "@mui/icons-material/Map"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import Map from "../Map/Map"
import RoutePolyline from "../Map/RoutePolyline"
import SelectedStopMarkers from "../Map/SelectedStopMarkers"
import StartEndMarkers from "../Map/StartEndMarkers"
import { useTripPlan, type Place } from "../../contexts/TripPlanContext"
import useIsMobile from "../../hooks/useIsMobile"
import { useState, useMemo } from "react"
import LayoutBand from "../UI/Layoutband/LayoutBand"

function StopCard({
  stop,
  index,
  onRemove,
  dragHandleProps,
}: {
  stop: Place
  index: number
  onRemove: (id: string) => void
  dragHandleProps: React.HTMLAttributes<HTMLDivElement> | null | undefined
}) {
  return (
    <Card sx={{ display: "flex", alignItems: "flex-start", p: { xs: 1, md: 1.5 }, gap: 1.5 }}>
      <Box
        {...dragHandleProps}
        sx={{ display: "flex", alignItems: "center", cursor: "grab", p: { xs: 1, md: 0.5 }, color: "text.disabled", alignSelf: "center" }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>
      <Avatar sx={{ bgcolor: "primary.main", width: 28, height: 28, fontSize: 13, flexShrink: 0, alignSelf: "center" }}>
        {index + 1}
      </Avatar>
      {stop.photoUrl ? (
        <CardMedia
          component="img"
          sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1, flexShrink: 0, display: { xs: "none", md: "block" } }}
          image={stop.photoUrl}
          alt={stop.name}
        />
      ) : (
        <Box sx={{ width: 80, height: 80, bgcolor: "grey.200", borderRadius: 1, flexShrink: 0, display: { xs: "none", md: "block" } }} />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Paragraph size="sm" sx={{ fontWeight: 600, mb: 0.25 }}>
          {stop.name}
        </Paragraph>
        {stop.rating > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
            <Rating value={stop.rating} precision={0.1} size="small" readOnly />
            <Paragraph size="xs">({stop.totalRatings})</Paragraph>
          </Box>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 0.5 }}>
          {stop.types.slice(0, 2).map((t) => (
            <Chip key={t} label={t.replace(/_/g, " ")} size="small" variant="outlined" />
          ))}
        </Box>
        <Paragraph size="xs" sx={{ color: "text.secondary" }}>
          {stop.distanceFromStart} mi • {stop.driveTimeFromStart} from start
        </Paragraph>
      </Box>
      <IconButton
        size="small"
        color="error"
        aria-label="remove stop"
        onClick={() => onRemove(stop.id)}
        sx={{ flexShrink: 0, alignSelf: "center", p: { xs: 1, md: 0.5 } }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Card>
  )
}

export default function TripSummary() {
  const isMobile = useIsMobile()
  const [mobileView, setMobileView] = useState<"list" | "map">("list")
  const { state, dispatch } = useTripPlan()
  const {
    selectedStops,
    startLocation,
    endLocation,
    startLatLng,
    endLatLng,
    totalDistanceMiles,
    totalDriveTime,
  } = state

  const removeStop = (id: string) => {
    dispatch({
      type: "SET_SELECTED_STOPS",
      payload: selectedStops.filter((s) => s.id !== id),
    })
  }

  const waypoints = useMemo(() => selectedStops.map((s) => s.latLng), [selectedStops])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const reordered = [...selectedStops]
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    dispatch({ type: "SET_SELECTED_STOPS", payload: reordered })
  }

  return (
    <LayoutBand>
      {/* Mobile-only List / Map toggle */}
      {isMobile && (
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <ToggleButtonGroup
            value={mobileView}
            exclusive
            onChange={(_, v) => v && setMobileView(v)}
            fullWidth
            size="small"
          >
            <ToggleButton value="list">
              <ViewListIcon sx={{ mr: 0.75, fontSize: 18 }} />
              List
            </ToggleButton>
            <ToggleButton value="map">
              <MapIcon sx={{ mr: 0.75, fontSize: 18 }} />
              Map
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Main layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: { md: "calc(100vh - 240px)" },
          minHeight: { md: 500 },
          overflow: { md: "hidden" },
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            display: !isMobile ? "flex" : mobileView === "list" ? "flex" : "none",
            flexDirection: "column",
            borderRight: { md: 1 },
            borderColor: "divider",
            overflow: { md: "hidden" },
          }}
        >
          {/* Stats strip */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: "divider",
              flexShrink: 0,
              bgcolor: "background.paper",
            }}
          >
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={1}
              sx={{ justifyContent: "space-around", mb: 1.5 }}
            >
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {selectedStops.length}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Stops</Paragraph>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {totalDistanceMiles > 0 ? totalDistanceMiles : "—"}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Miles</Paragraph>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <Heading level="h3" size="h5" sx={{ mb: 0 }}>
                  {totalDriveTime || "—"}
                </Heading>
                <Paragraph size="xs" sx={{ color: "text.secondary" }}>Drive Time</Paragraph>
              </Box>
            </Stack>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <PlaceIcon sx={{ fontSize: 14, color: "secondary.main", flexShrink: 0 }} />
              <Paragraph size="xs" sx={{ fontWeight: 600, color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {startLocation}
              </Paragraph>
              <Paragraph size="xs" sx={{ color: "text.disabled", flexShrink: 0 }}>→</Paragraph>
              <Paragraph size="xs" sx={{ fontWeight: 600, color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {endLocation}
              </Paragraph>
              <PlaceIcon sx={{ fontSize: 14, color: "error.main", flexShrink: 0 }} />
            </Box>
          </Box>

          {/* Scrollable stop list */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
            {selectedStops.length === 0 ? (
              <Paragraph size="sm" sx={{ p: 1 }}>
                No stops selected. Go back to add some!
              </Paragraph>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="stops">
                  {(provided) => (
                    <Stack spacing={1.5} ref={provided.innerRef} {...provided.droppableProps}>
                      {selectedStops.map((stop, index) => (
                        <Draggable key={stop.id} draggableId={stop.id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps}>
                              <StopCard
                                stop={stop}
                                index={index}
                                onRemove={removeStop}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Stack>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </Box>
        </Box>

        {/* Outer clipping wrapper: collapses to 0 when hidden on mobile */}
        <Box
          sx={{
            flex: !isMobile ? 1 : undefined,
            height: !isMobile ? "100%" : mobileView === "map" ? "calc(100vh - 180px)" : 0,
            overflow: "hidden",
          }}
        >
          {/* Inner map: always at full size so Google Maps initializes with real dimensions */}
          <Box sx={{ width: "100%", height: !isMobile ? "100%" : "calc(100vh - 180px)" }}>
            <Map height="100%">
              {startLatLng && endLatLng && (
                <RoutePolyline
                  startLatLng={startLatLng}
                  endLatLng={endLatLng}
                  waypoints={waypoints}
                  fetchPlaces={false}
                />
              )}
              <StartEndMarkers />
              <SelectedStopMarkers />
            </Map>
          </Box>
        </Box>
      </Box>
    </LayoutBand>
  )
}
