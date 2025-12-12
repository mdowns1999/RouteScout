import {
  AppBar,
  Container,
  Stack,
  Toolbar,
  IconButton,
} from "@mui/material"
import MyLocationIcon from '@mui/icons-material/MyLocation'
import Heading from "../../components/UI/Heading/Heading"
import Nav from "../Nav/Nav"
import { NightlightRound, Sunny } from "@mui/icons-material"
import { useThemeMode } from "../../contexts/ThemeModeContext"

export default function Header() {
  const { mode, toggleColorMode } = useThemeMode()

  return (
    <AppBar>
      <Container>
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <MyLocationIcon/>
              <Heading style={{margin: 0}}>Route Scout</Heading>
            </Stack>
            <Stack direction="row" gap={3}>
              <Nav />
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
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
