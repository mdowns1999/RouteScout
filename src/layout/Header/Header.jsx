import {
  AppBar,
  Container,
  Stack,
  Toolbar,
  Link,
  IconButton,
} from "@mui/material"
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
            <Heading>Route Scout</Heading>
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
