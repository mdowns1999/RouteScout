import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Box,
  Chip,
  Container,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import Heading from "../UI/Heading/Heading"
import Paragraph from "../UI/Paragraph/Paragraph"
import { useTripPlan } from "../../contexts/TripPlanContext"
import { CATEGORIES as categories } from "../../constants/categories"
import { useState } from "react"

const INTERESTS_DISMISSED_KEY = "routescout_dismissed_interests"
const MAX_INTERESTS = 5

export default function InterestsView() {
  const { state, dispatch } = useTripPlan()
  const selected = state.selectedInterests
  const [search, setSearch] = useState("")
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(INTERESTS_DISMISSED_KEY))

  const atLimit = selected.length >= MAX_INTERESTS

  const handleSelect = (catId: string) => {
    if (!selected.includes(catId) && atLimit) return
    const newInterests = selected.includes(catId)
      ? selected.filter((id) => id !== catId)
      : [...selected, catId]
    dispatch({ type: "SET_SELECTED_INTERESTS", payload: newInterests })
  }

  const dismissWelcome = () => {
    localStorage.setItem(INTERESTS_DISMISSED_KEY, "1")
    setShowWelcome(false)
  }

  const filtered = search.trim()
    ? categories.filter(
        (cat) =>
          cat.title.toLowerCase().includes(search.toLowerCase()) ||
          cat.subtitle.toLowerCase().includes(search.toLowerCase())
      )
    : categories

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Heading level="h1" size="h4" centered>
          What Interests You?
        </Heading>
        <Paragraph size="sm" centered>
          Pick up to {MAX_INTERESTS} categories — we'll find stops along your route for each one.
        </Paragraph>
      </Box>

      {showWelcome && (
        <Card variant="outlined" sx={{ mb: 3, bgcolor: "primary.50", borderColor: "primary.200" }}>
          <CardContent sx={{ py: "12px !important", pr: "12px !important" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Paragraph size="sm" sx={{ flex: 1 }}>
                Select the types of places you'd like to stop at. We'll use these to suggest stops along your route.
              </Paragraph>
              <IconButton size="small" onClick={dismissWelcome} sx={{ flexShrink: 0, mt: -0.5 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}

      <TextField
        fullWidth
        size="small"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch("")}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Paragraph size="sm" sx={{ color: "text.secondary" }}>
            No categories match your search.
          </Paragraph>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((cat) => {
            const isSelected = selected.includes(cat.id)
            const isDisabled = !isSelected && atLimit
            return (
              <Grid key={cat.id} size={{ xs: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    opacity: isDisabled ? 0.38 : 1,
                    bgcolor: isSelected ? "primary.main" : "background.paper",
                    borderColor: isSelected ? "primary.main" : undefined,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: isDisabled ? "background.paper" : isSelected ? "primary.dark" : "action.hover",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleSelect(cat.id)}
                    disabled={isDisabled}
                    sx={{ height: "100%", cursor: isDisabled ? "not-allowed" : "pointer" }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <Box sx={{ mb: 1.5 }}>
                        <cat.Icon
                          sx={{
                            fontSize: 40,
                            color: isSelected ? "primary.contrastText" : "primary.main",
                          }}
                        />
                      </Box>
                      <Heading
                        level="h3"
                        size="h6"
                        sx={{ color: isSelected ? "primary.contrastText" : "inherit", mb: 0.5 }}
                      >
                        {cat.title}
                      </Heading>
                      <Paragraph
                        size="xs"
                        sx={{ color: isSelected ? "rgba(255,255,255,0.85)" : "text.secondary" }}
                      >
                        {cat.subtitle}
                      </Paragraph>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1, flexWrap: "wrap" }}>
        <Chip
          label={`${selected.length} / ${MAX_INTERESTS} selected`}
          color={atLimit ? "warning" : selected.length > 0 ? "primary" : "default"}
          sx={{ fontWeight: 600 }}
        />
        {atLimit && (
          <Chip
            label="Limit reached — deselect one to swap"
            variant="outlined"
            color="warning"
            size="small"
            sx={{ alignSelf: "center" }}
          />
        )}
      </Box>
    </Container>
  )
}
