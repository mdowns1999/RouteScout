import {
  AppBar,
  Container,
  Stack,
  Toolbar,
  IconButton,
  Button,
  Box,
} from "@mui/material"
import MyLocationIcon from "@mui/icons-material/MyLocation"
import Heading from "../../components/UI/Heading/Heading"
import Nav from "../Nav/Nav"
import {
  NightlightRound,
  Sunny,
  HelpOutline,
  PersonOutline,
} from "@mui/icons-material"
import { useThemeMode } from "../../contexts/ThemeModeContext"

export default function Header() {
  const { mode, toggleColorMode } = useThemeMode()

  return (
    <AppBar elevation={2}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar disableGutters>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Stack direction="row" alignItems="center" gap={{ xs: 1, md: 4 }}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MyLocationIcon sx={{ color: "white" }} />
                </Box>
                <Heading style={{ margin: 0 }}>RouteScout</Heading>
              </Stack>
              <Nav />
            </Stack>
            <Stack direction="row" gap={{ xs: 1, lg: 2 }} alignItems="center">
              <Stack
                direction="row"
                gap={1}
              >
                <IconButton
                  aria-label="help"
                  size="small"
                  sx={{ color: "white" }}
                >
                  <HelpOutline fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="toggle dark mode"
                  size="small"
                  onClick={toggleColorMode}
                  sx={{ color: "white" }}
                >
                  {mode === "dark" ? (
                    <NightlightRound fontSize="small" />
                  ) : (
                    <Sunny fontSize="small" />
                  )}
                </IconButton>
              </Stack>
              <IconButton
                aria-label="sign in"
                size="small"
                sx={{ color: "white", display: { xs: "flex", lg: "none" } }}
              >
                <PersonOutline fontSize="small" />
              </IconButton>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: "white",
                  borderColor: "white",
                  display: { xs: "none", lg: "flex" },
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
