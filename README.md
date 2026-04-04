# RouteScout

A multi-step road trip planning wizard that helps you discover interesting stops along any route.

**Live site:** https://mdowns1999.github.io/RouteScout/

---

## What It Does

RouteScout walks you through a 4-step wizard:

1. **Locations & Preferences** — Enter a start and destination, set a budget, ranking preference, and search radius
2. **Interests** — Pick from 10 categories (food, nature, history, adventure, etc.)
3. **Suggested Stops** — An interactive Google Map shows places along your route; select the ones you want
4. **Trip Summary** — Reorder or remove stops with drag-and-drop, then export your trip

From the export page you can open the route in Google Maps or Apple Maps, download a GPX file, or copy a share link that lets anyone view your trip in read-only mode.

---

## Tech Stack

| Area | Library |
|------|---------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Routing | React Router 7 |
| UI | Material UI (MUI) 7 |
| Drag & drop | @hello-pangea/dnd |
| Maps | Google Maps JavaScript API (via `@vis.gl/react-google-maps`) |
| State | React Context + useReducer |
| Backend | Node/Express + MongoDB (deployed on Render) |
| Hosting | GitHub Pages |

---

## Google Maps Integration

Three Google APIs are used:

- **Geocoding API** — Converts the user's typed start/end locations into `{ lat, lng }` coordinates (called in `TripPage.tsx` on step 1 → step 2 transition)
- **Routes API** — Fetches the driving route polyline and samples waypoints along it to find nearby places
- **Places API (New / v1)** — `nearbySearch` fetches places of the selected interest types near each sampled waypoint. Place photos are loaded via the Places photo endpoint.

All Google API calls live in `src/components/Map/RoutePolyline.tsx`.

A `VITE_GOOGLE_MAPS_API_KEY` environment variable is required. Create a `.env.local` file at the project root:

```
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

The key needs these APIs enabled in Google Cloud Console:
- Maps JavaScript API
- Geocoding API
- Routes API
- Places API (New)

---

## Material UI Notes

- Theme is defined in `src/theme.tsx` — Ocean Blue primary, Palm Green secondary
- Light/dark mode is toggled via `ThemeModeContext` and persisted to `localStorage`
- UI primitives (`Heading`, `Paragraph`, `LayoutBand`, `Separator`, `Row`, `Image`) live in `src/components/UI/` — prefer these over raw MUI typography for consistent sizing

---

## Backend

The backend is a separate Node/Express app deployed at `https://routescoutbackend.onrender.com`.

API docs: https://routescoutbackend.onrender.com/api-docs/

Routes used:
- `POST /api/trips` — saves a trip when the user clicks "Export Your Trip", returns a `tripId`
- `GET /api/trips/:id/share` — fetches a saved trip for the share page

The frontend API client is in `src/services/tripApi.ts`. `availableStops` is intentionally not saved (ephemeral Google Places data).

---

## Local Development

```bash
npm install
npm run dev        # start dev server at localhost:5173
npm run build      # production build
npm run lint       # ESLint check
npm run test       # run Jest tests once
```

---

## State Management

All wizard state lives in a single `TripPlanContext` (`src/contexts/TripPlanContext.tsx`) using `useReducer`. State is persisted to `sessionStorage` on every change so it survives page refreshes within a session. Calling `resetTrip()` clears sessionStorage and resets to initial state.

Key state fields: `startLocation`, `endLocation`, `startLatLng`, `endLatLng`, `budget`, `rankPreference`, `searchRadius`, `selectedInterests`, `selectedStops`, `totalDistanceMiles`, `totalDriveTime`, `tripId`.

---

## Deployment

The app is deployed to GitHub Pages at the basename `/RouteScout`. The Vite config and React Router `basename` are both set to `/RouteScout`. To deploy:

```bash
npm run build
# push dist/ to the gh-pages branch, or use the gh-pages npm package
```
