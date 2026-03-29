# RouteScout — Claude Code Prompt
> Feed this entire document to Claude Code at the start of your session.

---

## 1. TASK CONTEXT

You are an expert full-stack React developer helping me finish a road trip planning web app called **RouteScout**. The app is partially built. Your job is to take it from a mostly placeholder/mock-data state to a fully functional, polished app that is ready to ship. The app already has a working UI structure and routing — the primary work is wiring up real Google APIs, fixing broken flows, connecting state across components, and polishing the design using Material UI.

---

## 2. TONE & APPROACH

- Write clean, production-quality TypeScript. No shortcuts.
- Prefer simple, readable code over clever abstractions — this is a solo developer project.
- If something is unclear or could go multiple ways, pause and ask before writing code.
- When you make a decision on my behalf, explain it briefly in a comment or a note.
- Do not refactor things that aren't broken. Focus on what is described.
- Commit to one change at a time. Do not rewrite large swaths of the app unless I ask.

---

## 3. BACKGROUND — APP OVERVIEW

**RouteScout** is a React road trip planner. The user enters a start and end location, selects interest categories, sees real places along their route on a Google Map, selects which stops they want, reviews the trip summary, and exports it to Google Maps or Apple Maps.

### Current Tech Stack
- **Frontend**: React + Vite, TypeScript, React Router
- **State**: useState + useContext only (no Redux/Zustand)
- **Maps**: `@vis.gl/react-google-maps` package
- **UI Library**: Material UI (MUI)
- **API Key**: Already stored in `.env` as `VITE_GOOGLE_MAPS_API_KEY`
- **Backend** *(not built yet)*: Planned as Node.js + Express + MongoDB — do NOT build it yet, but document the API routes we will need (see Section 8)

### Current App State (What Exists)
The app has 4 steps wired up with React Router:

| Step | Route | Status |
|------|-------|--------|
| Plan Trip | `/trip/plan` | UI exists, placeholder data only |
| Select Interests | `/trip/interests` | UI exists, not connected to state |
| Select Stops | `/trip/stops` | Map renders but has NO pins, no real data |
| Trip Summary | `/trip/summary` | Shows placeholder data |
| Export | `/trip/export` | UI exists, export not functional |

**The map appears on screen but is not connected to anything — no pins, no route line, no real places.**

### Google APIs I Have Access To
All enabled under one Google Cloud project. The API key is already in `.env`.

**Must-Have (wire these up):**
- Maps JavaScript API (already loading via `@vis.gl/react-google-maps`)
- Places API (New) — for searching places along the route
- Routes API — for drawing the route line from A to B

**Nice-to-Have (add if straightforward):**
- Geocoding API — convert plain city/address text to lat/lng coordinates

> **Note on ratings & photos**: Ratings and photos come from the **Places API (New)** — specifically the `places.get` or `places.searchAlongRoute` endpoints. No separate API needed.

---

## 4. DETAILED TASK DESCRIPTION & RULES

Work through the following tasks **in order**. Complete and confirm each one before moving to the next.

---

### TASK 1 — Global Trip State (Context)

Create or fix a `TripContext` that holds the full trip state across all steps:

```typescript
interface TripState {
  startLocation: string;       // plain text, e.g. "Boise, ID"
  endLocation: string;         // plain text, e.g. "Portland, OR"
  startLatLng: LatLng | null;  // resolved via Geocoding API
  endLatLng: LatLng | null;
  budget: string;
  duration: string;
  travelPace: string;
  selectedInterests: string[]; // e.g. ["nature", "food"]
  availableStops: Place[];     // fetched from Places API
  selectedStops: Place[];      // user-chosen stops
}

interface Place {
  id: string;
  name: string;
  address: string;
  latLng: LatLng;
  rating: number;
  totalRatings: number;
  photoUrl: string | null;
  types: string[];             // Google place types
  distanceFromStart: number;   // miles
  driveTimeFromStart: string;  // e.g. "1h 10m"
}
```

- Persist state to `sessionStorage` so a page refresh doesn't wipe the trip.
- Expose a `resetTrip()` function.

---

### TASK 2 — Geocoding (Start & End Locations)

On the Plan Trip page (`/trip/plan`), when the user clicks "Continue to Interests":

1. Call the **Geocoding API** to convert `startLocation` and `endLocation` strings to `{ lat, lng }`.
2. Store the resolved coordinates in `TripContext` (`startLatLng`, `endLatLng`).
3. Show a MUI `CircularProgress` spinner on the button while resolving.
4. If geocoding fails (bad address), show a MUI `Alert` error inline — do not navigate away.

Use the REST endpoint: `https://maps.googleapis.com/maps/api/geocode/json?address=...&key=...`

---

### TASK 3 — Route Line on the Map (Routes API)

On the Select Stops page (`/trip/stops`), once `startLatLng` and `endLatLng` are available:

1. Call the **Routes API** (`https://routes.googleapis.com/directions/v2:computeRoutes`) to get the encoded polyline for the route.
2. Decode the polyline and render it as a `<Polyline>` on the map using `@vis.gl/react-google-maps`.
3. Fit the map bounds to show the full route.
4. Use a teal/dark blue color (`#1a6b6b` or similar) for the route line, weight 5.

Route API request body:
```json
{
  "origin": { "location": { "latLng": { "latitude": ..., "longitude": ... } } },
  "destination": { "location": { "latLng": { "latitude": ..., "longitude": ... } } },
  "travelMode": "DRIVE",
  "polylineQuality": "HIGH_QUALITY"
}
```
Required header: `X-Goog-FieldMask: routes.polyline,routes.legs`

---

### TASK 4 — Fetch Real Places Along the Route (Places API New)

After the route polyline is available, fetch real places:

1. Use **Places API (New)** `nearbySearch` or `searchText` to find places along the route.
2. Filter by the user's `selectedInterests` — map our interest categories to Google `includedTypes`:

| Our Category | Google Types |
|---|---|
| Food & Dining | `restaurant`, `cafe`, `bakery`, `bar` |
| Nature & Outdoors | `park`, `campground`, `national_park`, `hiking_area` |
| History & Culture | `museum`, `historical_landmark`, `art_gallery` |
| Adventure Sports | `sports_complex`, `rock_climbing_gym` |
| Photography Spots | `scenic_point`, `viewpoint` |
| Shopping | `shopping_mall`, `market`, `store` |
| Tourist Attractions | `tourist_attraction`, `amusement_park` |
| Hidden Gems | `point_of_interest` |

3. For each result, request these fields: `id,displayName,formattedAddress,location,rating,userRatingCount,photos,types,primaryType`
4. For photos: fetch the first photo using the Places Photo endpoint and store the URL.
5. Store all results as `availableStops` in `TripContext`.

> **Strategy**: Divide the route into segments (every ~50 miles) and do a `nearbySearch` at each midpoint with a 25-mile radius. Deduplicate by `place.id`.

---

### TASK 5 — Map Pins & Info Window

On the Select Stops page map:

1. Render an `<AdvancedMarker>` for each place in `availableStops`.
2. Use a custom pin: teal circle with a white icon matching the place's primary type (use MUI icons).
3. Selected stops get a filled/highlighted pin. Unselected are muted.
4. When a pin is clicked, show a MUI-styled `<InfoWindow>` popup containing:
   - Place photo (or a placeholder image if none)
   - Place name (bold)
   - Star rating + review count
   - A "Add Stop" / "Remove Stop" toggle button
5. Only one InfoWindow open at a time.

---

### TASK 6 — Stop Selection Sync

The left sidebar checkboxes and the map pins must stay in sync:

- Checking a sidebar item → pin becomes selected (highlighted)
- Clicking a pin → InfoWindow appears, "Add Stop" adds it to selected list
- Selected stops update `TripContext.selectedStops` immediately
- The "X Stops Selected" badge at the top updates in real time

---

### TASK 7 — Trip Summary Page

On `/trip/summary`, replace all placeholder data with real data from `TripContext`:

- Show real stop count, total distance (from Routes API response), estimated drive time
- Show real `startLocation` → `endLocation`
- List each stop in `selectedStops` with: photo, name, rating, tags, distance from start, drive time from start
- Allow removing a stop (red trash icon) — updates `selectedStops` in context
- The map on this page should show the same route line + pins for selected stops only

---

### TASK 8 — Export Page

On `/trip/export`, make the exports functional:

**Google Maps export:**
Build a Google Maps URL with waypoints:
```
https://www.google.com/maps/dir/?api=1
  &origin=START_ADDRESS
  &destination=END_ADDRESS
  &waypoints=STOP1_LAT,LNG|STOP2_LAT,LNG
  &travelmode=driving
```
Open in a new tab.

**Apple Maps export:**
```
https://maps.apple.com/?saddr=START&daddr=END
```
Open in a new tab. Note: Apple Maps URLs don't support multiple waypoints natively — open with just start and end, and note this limitation in a small MUI `Tooltip`.

**Export GPX File**: Generate a `.gpx` file from the trip data and trigger a browser download. GPX is the universal format supported by Garmin devices, Waze, hiking apps, and most dedicated GPS hardware. Build the file as a string in the browser — no backend needed.

GPX structure to generate:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RouteScout">
  <metadata><name>TRIP_NAME</name></metadata>
  <rte>
    <name>TRIP_NAME</name>
    <!-- one <rtept> per selected stop, in order -->
    <rtept lat="STOP_LAT" lon="STOP_LNG">
      <name>STOP_NAME</name>
      <desc>STOP_ADDRESS</desc>
    </rtept>
  </rte>
</gpx>
```

Trigger the download with a temporary `<a>` element and a `Blob` URL. Name the file `routescout-trip.gpx`. Show a MUI `Snackbar` confirmation ("GPX file downloaded — open it in your GPS app").

**Share Link**: Generate a URL with trip state encoded as base64 in the query string (e.g. `/trip/share?data=BASE64`). Copy to clipboard with a MUI `Snackbar` confirmation.

---

### TASK 9 — Design Polish & Layout (MUI)

The goal is a clean, intuitive app that works great on both **desktop and mobile**. Every page should feel focused — one clear thing to do, no visual clutter, obvious next step. Use MUI's `sx` prop, `theme`, and responsive `Grid`/`Stack` throughout. Do not use custom CSS files unless MUI cannot accomplish the goal.

---

#### Global Design Tokens (set in MUI theme)

Add DM Sans from Google Fonts by placing this in the `<head>` of `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

The app already has a dark/light mode toggle — **preserve it fully**. The existing palette is well-considered and should not be replaced, only extended. Wire it into MUI's `createTheme` like this:

```typescript
const theme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main:         mode === 'light' ? '#2e6f95' : '#6ba3c6',  // Ocean Blue
      light:        mode === 'light' ? '#5b95b8' : '#9dc4da',
      dark:         mode === 'light' ? '#1f4f6a' : '#4a8aad',
      contrastText: mode === 'light' ? '#ffffff' : '#000000',
    },
    secondary: {
      main:         mode === 'light' ? '#3f7d58' : '#5ca582',  // Palm Green
      light:        mode === 'light' ? '#6b9d7f' : '#8bc4a6',
      dark:         mode === 'light' ? '#2c5940' : '#3f8763',
      contrastText: '#ffffff',
    },
    error: {
      main:  mode === 'light' ? '#d6594d' : '#e07b72',
      light: mode === 'light' ? '#e07b72' : '#ec9d96',
      dark:  mode === 'light' ? '#b23e33' : '#c95d51',
    },
    warning: {
      main:  mode === 'light' ? '#f4b942' : '#f7cb6d',         // Golden Sun
      light: mode === 'light' ? '#f7cb6d' : '#fad991',
      dark:  mode === 'light' ? '#d69e25' : '#f0b744',
    },
    background: {
      default: mode === 'light' ? '#f6f1e9' : '#1a1a1e',       // Passport Cream / Warm Dark
      paper:   mode === 'light' ? '#ffffff' : '#2a2a2e',
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    fontWeightBold: 700,
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.mode === 'light' ? '#e0ddd6' : '#3a3a3e'}`,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
  },
});
```

> **Dark mode note**: The existing palette uses custom keys (`paperSecondary`, `accent.vintage`, `accent.vintageLight`) that MUI doesn't know about by default. Create a `src/theme.d.ts` declaration file that extends MUI's `TypeBackground` and `Palette` interfaces so these can be used safely via `theme.palette.accent.vintage` etc. throughout the app without TypeScript errors.

---

#### Global Layout Rules

- **Max content width**: `1200px`, centered with `mx: 'auto'`
- **Page padding**: `px: { xs: 2, sm: 3, md: 4 }`, `py: 4`
- **Progress bar + step labels**: sticky at the top on all step pages, never scrolls away
- **Primary CTA button**: always full-width on mobile (`xs`), auto-width on desktop
- **Loading states**: MUI `Skeleton` for content areas, `CircularProgress` centered on buttons
- **Error states**: MUI `Alert severity="error"` inline, directly below the field or section that failed

---

#### Per-Page Layout

**Plan Trip (`/trip/plan`)**
- Stack the two panels vertically on mobile; side-by-side (`Grid`) on desktop
- Route Details panel (left, 60% width desktop): large, clear text inputs for Start and End with an outlined style. Add a swap button (↕) between them — clicking it swaps start/end values
- Travel Preferences panel (right, 40% width desktop): Budget, Duration, Travel Pace dropdowns stacked cleanly
- The "Continue" button sits below both panels, centered, full-width on mobile
- Add a subtle hero area at the top: app icon + "Plan your Road Trip" h4 heading + one-line description. Keep it short — this is not a marketing page

**Interests (`/trip/interests`)**
- This page is mostly fine — keep the 3-column grid on desktop, 2-column on tablet, 1-column on mobile
- Selected cards: filled teal background with white text and icon — make the selection state obvious
- Unselected cards: white background, dark text, light border
- The category icon should be larger (40px) and sit above the text, not beside it
- Show the selected count badge ("2 categories selected") as a MUI `Chip` in teal, centered below the grid, above the Continue button

**Stops (`/trip/stops`)**
- This is the most important page — the map should be the hero
- **Desktop**: Map takes 65% of the width (right side). Sidebar takes 35% (left side). Both fill the full viewport height below the progress bar — no scrolling the outer page, only the sidebar list scrolls internally
- **Mobile**: Map collapses to a fixed 300px tall strip at the top. Sidebar list appears below it and scrolls normally
- Sidebar header: show route summary ("Boise, ID → Portland, OR · 2 stops selected") in small text. Below that, a scrollable list of available stops as compact cards (photo thumbnail left, name + rating right, checkbox far right)
- Map: route line in teal, start/end markers distinct from stop markers (use a flag/pin icon for start/end, circle markers for stops)
- "Continue to Summary" button: fixed/sticky at the bottom of the sidebar on desktop, fixed bottom bar on mobile

**Summary (`/trip/summary`)**
- **Desktop**: Same 35/65 split as Stops page. Left sidebar = stop list. Right = map showing only selected stops + route
- The sidebar stop list cards should be more generous than the Stops page: show photo (wider thumbnail), name, rating, tags (MUI `Chip` components), and distance/time from start
- The Trip Overview stats (stops, distance, drive time) should appear as a compact horizontal strip at the top of the sidebar — three stat blocks side by side — not buried in a card
- Remove stop: red trash `IconButton` on each card, asks for no confirmation (just removes immediately and updates the map)
- **Mobile**: Stats strip → stop list (scrollable) → map (300px fixed) stacked vertically

> **Important**: Work through the per-page layouts **one page at a time**. After completing each page, show a summary of what changed and ask "Ready to move to the next page?" before touching the next one.

**Export (`/trip/export`)**
- Collapse the three stacked card sections into a single clean page with clear visual grouping — not three separate cards
- Layout: centered, max-width `600px`, so it feels focused not sprawling
- Top section: success icon + "Your Trip is Ready!" heading + Trip Summary stats (stops, miles, drive time) in one compact row
- Middle section: "Open in Maps" — two large buttons side by side (Google Maps, Apple Maps), each with the platform logo/icon and a short label. On mobile, stack them
- Bottom section: two secondary actions in a row — "Export GPX" (outlined button with download icon, for GPS devices) and "Copy Share Link" (outlined button with copy icon). On mobile, stack them
- Remove the Download/Export card and Share card as separate visual blocks — they should just be buttons, not cards

---

## 5. EXAMPLES

### Example: Fetching places (Places API New)
```typescript
const fetchPlacesAlongRoute = async (
  midpoint: LatLng,
  types: string[],
  apiKey: string
): Promise<Place[]> => {
  const response = await fetch(
    'https://places.googleapis.com/v1/places:nearbySearch',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.types',
      },
      body: JSON.stringify({
        locationRestriction: {
          circle: {
            center: { latitude: midpoint.lat, longitude: midpoint.lng },
            radius: 40000, // ~25 miles in meters
          },
        },
        includedTypes: types,
        maxResultCount: 10,
      }),
    }
  );
  const data = await response.json();
  return data.places ?? [];
};
```

### Example: Decoding a polyline
```typescript
// Use the @googlemaps/polyline-codec package
import { decode } from '@googlemaps/polyline-codec';

const path = decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));
```

---

## 6. CONVERSATION HISTORY / CURRENT KNOWN BUGS

- The "From" and "To" fields on the Export page show single letters ("d" and "s") — this is because state is not being passed correctly. Fix as part of Task 1.
- The map on the Stops page renders but has zero pins — no data is being fetched. Fix in Tasks 3–5.
- Interest categories are selected on the Interests page but not stored anywhere — fix in Task 1.

---

## 7. IMMEDIATE TASK — WHERE TO START

**Start with Task 1 (TripContext).** Show me the full `TripContext` file you plan to create, explain the shape, and wait for my approval before writing any other files. We will go task by task.

---

## 8. BACKEND API ROUTES (Document Only — Do Not Build)

When we build the Node/Express/MongoDB backend later, we will need these routes:

| Method | Route | Purpose | Request Body | Response |
|--------|-------|---------|--------------|----------|
| `POST` | `/api/trips` | Save a trip | `{ tripState: TripState }` | `{ tripId: string }` |
| `GET` | `/api/trips/:id` | Load a saved trip | — | `{ tripState: TripState }` |
| `PUT` | `/api/trips/:id` | Update a trip | `{ tripState: Partial<TripState> }` | `{ success: true }` |
| `DELETE` | `/api/trips/:id` | Delete a trip | — | `{ success: true }` |
| `GET` | `/api/trips/:id/share` | Get shareable trip (public, read-only) | — | `{ tripState: TripState }` |

MongoDB schema: one `trips` collection, one document per trip. No user auth needed for now — trips are accessed by ID only.

---

## 9. OUTPUT FORMATTING

- Always show full file contents when creating or significantly editing a file — no truncation.
- Use TypeScript throughout. No `any` types unless absolutely necessary — use `unknown` and narrow it.
- Group related code: types at the top, helpers in the middle, component/export at the bottom.
- When adding a new npm package, tell me the exact install command first and wait for confirmation.
- After completing each numbered Task, summarize what was done in 2–3 bullet points and ask: *"Ready to move to Task X?"*

---

## 10. PREFILLED RESPONSE (How to Start)

Begin your response exactly like this:

> **Understood. Let's build RouteScout.**
>
> I've reviewed the full spec. Here's what I'm starting with:
>
> **Task 1 — TripContext**
> Here is the `TripContext.tsx` file I plan to create...

Then show the full file.
