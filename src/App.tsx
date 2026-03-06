import { RouterProvider, createBrowserRouter } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import TripPage from "./pages/TripPage/TripPage"
import MyTripsPage from "./pages/MyTripsPage/MyTripsPage"
import DiscoverPage from "./pages/DiscoverPage/DiscoverPage"
import HelpPage from "./pages/HelpPage/HelpPage"
import TripExport from "./components/TripExport/TripExport"
import RootLayout from "./layout/Root"
import ErrorPage from "./pages/ErrorPage/ErrorPage"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "trip", element: <TripPage /> },
        { path: "trip/export", element: <TripExport /> },
        { path: "my-trips", element: <MyTripsPage /> },
        { path: "discover", element: <DiscoverPage /> },
        { path: "help", element: <HelpPage /> },
      ],
    },
  ],
  { basename: "/route-scout" },
)

function App() {
  return <RouterProvider router={router} />
}

export default App
