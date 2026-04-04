import { RouterProvider, createBrowserRouter } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import TripPage from "./pages/TripPage/TripPage"
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
      ],
    },
  ],
  { basename: "/RouteScout" },
)

function App() {
  return <RouterProvider router={router} />
}

export default App
