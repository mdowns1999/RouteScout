import { useState } from "react"
import { Stack, Button, Drawer } from "@mui/material"
import { Link } from "react-router-dom"
import MenuIcon from "@mui/icons-material/Menu"

//https://muhimasri.com/blogs/mui-reponsive-navbar/

const pages = [
  { name: "Home", id: "home", path: "/" },
  { name: "Plan Trip", id: "trip", path: "/trip" },
]

function NavList({ sx, ...props }) {
  return (
    <Stack
      overflow="auto"
      direction={{ xs: "column", sm: "row" }}
      gap={3}
      ml={{ xs: 3, sm: 0 }}
      mt={{ xs: 3, sm: 0 }}
      width={{ xs: "150px", sm: "initial" }}
      sx={{
        '& a': {
          color: 'white',
          textDecoration: 'none',
          '&:hover': {
            opacity: 0.8,
          },
        },
        ...sx,
      }}
      {...props}
    >
      {pages.map((page) => (
        <Link to={page.path} key={page.id}>
          {page.name}
        </Link>
      ))}
    </Stack>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }
  return (
    <>
      <Button
        variant="text"
        onClick={toggleDrawer(true)}
        sx={{ color: "white", display: { xs: "flex", sm: "none" } }}
      >
        <MenuIcon />
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        sx={{
          display: { xs: "inherit", sm: "none" },
        }}
      >
        <NavList />
      </Drawer>
      <NavList
        sx={{
          display: { xs: "none", sm: "inherit" },
        }}
      />
    </>
  )
}
