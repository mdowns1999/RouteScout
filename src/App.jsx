import { RouterProvider, createBrowserRouter } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import TripPage from "./pages/TripPage/TripPage"
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
      ],
    },
  ],
  { basename: "/route-scout" }
)

function App() {
  return <RouterProvider router={router} />
}

export default App
