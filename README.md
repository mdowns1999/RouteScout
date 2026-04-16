# RouteScout

A multi-step road trip planning wizard that discovers interesting stops along any driving route.

**Live site:** https://mdowns1999.github.io/RouteScout/

---

## What It Does

RouteScout walks you through a 5-step wizard:

1. **Locations & Preferences** — Enter start and destination, set a daily budget, search radius, and stop ranking preference
2. **Route Selection** — Choose from up to 4 route options (Fastest, Scenic, Avoid Highways, No Tolls), previewed on an interactive map
3. **Interests** — Pick up to 5 categories from 15 options (parks, food, history, adventure, etc.)
4. **Suggested Stops** — An interactive Google Map shows places along your chosen route; select the ones you want. Filter by rating, price level, distance, or category
5. **Trip Summary** — Reorder or remove stops with drag-and-drop; live mileage and drive time update as you edit

From the export page you can open the full route in Google Maps or Apple Maps, download a GPX file for any GPS device, or copy a share link so anyone can view your trip in read-only mode.

---

## Tech Stack

| Area | Library |
|------|---------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Routing | React Router 7 |
| UI | Material UI (MUI) 7 |
| Drag & drop | @hello-pangea/dnd |
| Maps | Google Maps JavaScript API (`@vis.gl/react-google-maps`) |
| State | React Context + useReducer |
| Backend | Node/Express + MongoDB (deployed on Render) |
| Hosting | GitHub Pages |

---

## Google Maps Integration

Four Google APIs are used:

| API | Where | Purpose |
|-----|-------|---------|
| **Geocoding API** | `src/pages/TripPage/TripPage.tsx` | Converts typed start/end locations to `{ lat, lng }` on step 1 → 2 transition. Results are cached in a module-level Map for the session |
| **Routes API** | `src/components/RouteSelectionView/RouteSelectionView.tsx` | Fetches up to 4 parallel route options on step 2 entry. Cached in context state (not re-fetched on back navigation) |
| **Routes API** | `src/components/Map/RoutePolyline.tsx` | Fetches the selected route's high-quality polyline for drawing and place sampling. Module-level cache keyed on start/end/waypoints |
| **Places API (New)** | `src/components/Map/RoutePolyline.tsx` | `nearbySearch` fetches places near each sampled waypoint for each selected interest category. Module-level cache keyed on location, types, radius, price levels, and rank preference |

Place photos are loaded via the Places photo endpoint using the `name` field from search results.

### Environment Setup

Create a `.env.local` file at the project root:

```
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

The key needs these APIs enabled in Google Cloud Console:
- Maps JavaScript API
- Geocoding API
- Routes API
- Places API (New)

### API Call Budget

Places API calls scale as `selected_categories × route_sample_points` (capped at 5 categories × 12 points = 60 calls per load). Results are cached for the session so navigating back to the map does not re-fetch.

---

## Local Development

```bash
npm install
npm run dev          # start dev server at localhost:5173
npm run build        # production build
npm run preview      # preview production build locally
npm run lint         # ESLint check
npm run test         # run Jest once
npm run test:watch   # Jest in watch mode
```

---

## Project Structure

```
src/
├── components/
│   ├── HeroBanner/          # Landing page hero
│   ├── InterestsView/       # Step 3 — category picker (max 5)
│   ├── LocationsView/       # Step 1 — locations + preferences
│   ├── Map/                 # RoutePolyline, StopMarkers, StartEndMarkers, etc.
│   ├── RouteSelectionView/  # Step 2 — route picker
│   ├── SuggestedStops/      # Step 4 — map + stop list + filter drawer
│   ├── TripExport/          # Export page
│   ├── TripSummary/         # Step 5 — drag-drop reorder
│   └── UI/                  # Heading, Paragraph, LayoutBand, Separator, Row, Image
├── constants/
│   └── categories.ts        # CATEGORIES list + INTEREST_TYPE_MAP (Places API types)
├── contexts/
│   ├── ThemeModeContext.tsx  # Light/dark toggle, persisted to localStorage
│   └── TripPlanContext.tsx   # All wizard state, persisted to sessionStorage
├── hooks/
│   └── useIsMobile.ts       # Breakpoint <768px
├── layout/
│   ├── Header/
│   └── Footer/
├── pages/
│   ├── LandingPage/
│   ├── TripPage/            # Wizard shell (progress bar + step routing)
│   └── TripShare/           # Read-only shared trip view
├── services/
│   └── tripApi.ts           # Backend REST client (create/get trips)
└── utils/
    └── routeUtils.ts        # decodePolyline, formatDriveTime
```

---

## State Management

All wizard state lives in `TripPlanContext` (`src/contexts/TripPlanContext.tsx`) via `useReducer`. State is persisted to `sessionStorage` on every change so it survives page refreshes within a session.

Key state fields:

| Field | Description |
|-------|-------------|
| `startLocation` / `endLocation` | User-typed location strings |
| `startLatLng` / `endLatLng` | Geocoded coordinates |
| `budget` | Daily budget band (`"0-50"`, `"50-100"`, `"100-200"`, `"200+"`) |
| `rankPreference` | Places sort order (`"POPULARITY"` or `"DISTANCE"`) |
| `searchRadius` | Miles from route to search for places |
| `routeOptions` | Array of up to 4 fetched route variants |
| `selectedRoute` | The route the user picked in step 2 |
| `selectedInterests` | Array of up to 5 category IDs |
| `availableStops` | All places returned by Places API (not persisted to backend) |
| `selectedStops` | Stops the user has checked |
| `stopFilters` | Active filter state (rating, price, distance, category) |
| `totalDistanceMiles` / `totalDriveTime` | Live stats shown in Trip Summary |
| `tripId` | Returned by backend after saving; used for the share link |

---

## Theme

Defined in `src/theme.tsx`:
- **Primary** — Ocean Blue (`#2e6f95` light / `#6ba3c6` dark)
- **Secondary** — Palm Green (`#3f7d58` light / `#5ca582` dark)
- **Background** — Passport Cream (`#f6f1e9` light)
- Font: DM Sans, fluid sizing with CSS `clamp()`

Light/dark mode is toggled in the header and persisted to `localStorage`.

---

## Backend

Separate Node/Express app deployed at `https://routescoutbackend.onrender.com`.

API docs: https://routescoutbackend.onrender.com/api-docs/

| Endpoint | When called | Purpose |
|----------|-------------|---------|
| `POST /api/trips` | User clicks "Export Your Trip" | Saves the trip, returns a `tripId` |
| `GET /api/trips/:id/share` | Share page load | Fetches a saved trip for read-only view |

The frontend client is in `src/services/tripApi.ts`. `availableStops` is intentionally not saved — it is ephemeral Google Places data regenerated from the saved route and interest selections.

---

## Deployment

The app deploys to GitHub Pages at basename `/RouteScout`.

```bash
npm run deploy    # runs build then publishes dist/ to the gh-pages branch
```

The Vite `base` config and React Router `basename` are both set to `/RouteScout`.
