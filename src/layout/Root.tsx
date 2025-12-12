import { Outlet } from "react-router-dom"
import { Toolbar } from "@mui/material"
import Header from "./Header/Header"
import Footer from "./Footer/Footer"



function RootLayout() {
  return (
    <div className="layout-wrapper">
      <Header />
      <Toolbar /> 
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
