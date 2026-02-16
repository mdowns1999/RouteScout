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
import MenuIcon from "@mui/icons-material/Menu"
import Heading from "../../components/UI/Heading/Heading"
import Nav from "../Nav/Nav"
import { NightlightRound, Sunny, HelpOutline } from "@mui/icons-material"
import { useThemeMode } from "../../contexts/ThemeModeContext"
import { useState } from "react"

export default function Header() {
  const { mode, toggleColorMode } = useThemeMode()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setDrawerOpen(newOpen)
  }

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
              <Nav drawerOpen={drawerOpen} onDrawerToggle={setDrawerOpen} />
            </Stack>
            <Stack direction="row" gap={{ xs: 1, lg: 2 }} alignItems="center">
              <Stack direction="row" gap={1}>
                <IconButton
                  aria-label="help"
                  size="small"
                  sx={{ color: "white", display: { xs: "none", md: "flex" } }}
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
                <IconButton
                  aria-label="menu"
                  size="small"
                  onClick={toggleDrawer(true)}
                  sx={{ color: "white", display: { xs: "flex", md: "none" } }}
                >
                  <MenuIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: "white",
                  borderColor: "white",
                  display: { xs: "none", md: "flex" },
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
