import { Stack, Button, Drawer, Divider } from "@mui/material"
import type { SxProps, Theme } from "@mui/material"
import { Link } from "react-router-dom"

//https://muhimasri.com/blogs/mui-reponsive-navbar/

const pages = [
  { name: "Home", id: "home", path: "/" },
  { name: "Plan Trip", id: "trip", path: "/trip" },
  { name: "My Trips", id: "my-trips", path: "/my-trips" },
  { name: "Discover", id: "discover", path: "/discover" },
  { name: "Help", id: "help", path: "/help" },
]

interface NavListProps {
  sx?: SxProps<Theme>;
  onLinkClick?: () => void;
  inDrawer?: boolean;
  [key: string]: unknown;
}

function NavList({
  sx,
  onLinkClick,
  inDrawer = false,
  ...props
}: NavListProps) {
  return (
    <Stack
      overflow="auto"
      direction={inDrawer ? "column" : { xs: "column", md: "row" }}
      gap={inDrawer ? 2 : { xs: 2, md: 2, lg: 3 }}
      ml={inDrawer ? 0 : { xs: 0, md: 0 }}
      mt={inDrawer ? 0 : { xs: 0, md: 0 }}
      p={inDrawer ? 3 : { xs: 3, md: 0 }}
      width={inDrawer ? "100%" : { xs: "100%", md: "initial" }}
      sx={{
        "& a": {
          color: "white",
          textDecoration: "none",
          padding: inDrawer ? "12px 16px" : { xs: "12px 16px", md: "0" },
          borderRadius: inDrawer ? "4px" : { xs: "4px", md: "0" },
          transition: "all 0.2s",
          display: "block",
          "&:hover": {
            opacity: inDrawer ? 1 : { xs: 1, md: 0.8 },
            backgroundColor: inDrawer
              ? "rgba(255, 255, 255, 0.1)"
              : { xs: "rgba(255, 255, 255, 0.1)", md: "transparent" },
          },
        },
        ...sx,
      }}
      {...props}
    >
      {pages.map((page) => (
        <Link to={page.path} key={page.id} onClick={onLinkClick}>
          {page.name}
        </Link>
      ))}
    </Stack>
  )
}

interface NavProps {
  drawerOpen?: boolean;
  onDrawerToggle?: (open: boolean) => void;
}

export default function Nav({ drawerOpen = false, onDrawerToggle }: NavProps) {
  const handleLinkClick = () => {
    if (onDrawerToggle) {
      onDrawerToggle(false)
    }
  }

  const handleDrawerClose = () => {
    if (onDrawerToggle) {
      onDrawerToggle(false)
    }
  }

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor="right"
        sx={{
          display: { xs: "inherit", md: "none" },
          "& .MuiDrawer-paper": {
            backgroundColor: "primary.main",
            width: "250px",
            pt: 2,
          },
        }}
      >
        <Stack px={3} pb={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleLinkClick}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Sign In
          </Button>
        </Stack>
        <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />
        <NavList onLinkClick={handleLinkClick} inDrawer />
      </Drawer>
      <NavList
        sx={{
          display: { xs: "none", md: "inherit" },
        }}
      />
    </>
  )
}
