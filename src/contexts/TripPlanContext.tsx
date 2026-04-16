import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

// --- Types ---

export interface LatLng {
  lat: number
  lng: number
}

export type RouteOptionId = 'fastest' | 'scenic' | 'no_highways' | 'no_tolls'

export interface RouteOption {
  id: RouteOptionId
  label: string
  distanceMiles: number
  durationMinutes: number
  hasTolls: boolean
  encodedPolyline: string
}

export interface StopFilters {
  minRating: number         // 0 = no filter
  maxPriceLevel: number     // 0 = no filter, 1–4 otherwise
  maxDistanceMiles: number  // 0 = no filter
  categoryIds: string[]     // empty = all categories
}

export interface Place {
  id: string
  name: string
  address: string
  latLng: LatLng
  rating: number
  totalRatings: number
  photoUrl: string | null
  types: string[]
  distanceFromStart: number   // miles
  driveTimeFromStart: string  // e.g. "1h 10m"
  phone: string | null
  description: string | null
  mapsUrl: string | null
  priceLevel: number          // 0 = unknown, 1–4
}

export interface TripPlanData {
  // Step 1: Locations & Preferences
  startLocation: string
  endLocation: string
  startLatLng: LatLng | null
  endLatLng: LatLng | null
  budget: string
  rankPreference: string      // "POPULARITY" | "DISTANCE"
  searchRadius: string        // miles as string

  // Step 2: Route Selection
  routeOptions: RouteOption[]
  selectedRoute: RouteOption | null

  // Step 3: Interests
  selectedInterests: string[]

  // Step 4: Suggested Stops
  availableStops: Place[]
  selectedStops: Place[]
  stopFilters: StopFilters

  // Route stats (set after route selection or Routes API call)
  totalDistanceMiles: number
  totalDriveTime: string

  // Backend
  tripId: string | null
}

// --- Action Types ---

type TripPlanAction =
  | { type: "SET_STARTING_POINT"; payload: string }
  | { type: "SET_DESTINATION"; payload: string }
  | { type: "SET_START_LATLNG"; payload: LatLng | null }
  | { type: "SET_END_LATLNG"; payload: LatLng | null }
  | { type: "SET_BUDGET"; payload: string }
  | { type: "SET_RANK_PREFERENCE"; payload: string }
  | { type: "SET_SEARCH_RADIUS"; payload: string }
  | { type: "SET_ROUTE_OPTIONS"; payload: RouteOption[] }
  | { type: "SET_SELECTED_ROUTE"; payload: RouteOption }
  | { type: "SET_SELECTED_INTERESTS"; payload: string[] }
  | { type: "SET_AVAILABLE_STOPS"; payload: Place[] }
  | { type: "SET_SELECTED_STOPS"; payload: Place[] }
  | { type: "SET_STOP_FILTERS"; payload: StopFilters }
  | { type: "SET_ROUTE_STATS"; payload: { distanceMiles: number; driveTime: string } }
  | { type: "SET_TRIP_ID"; payload: string }
  | { type: "SWAP_LOCATIONS" }
  | { type: "RESET" }

// --- Context Type ---

interface TripPlanContextType {
  state: TripPlanData
  dispatch: React.Dispatch<TripPlanAction>
  isStep1Valid: () => boolean
  isStep2Valid: () => boolean
  isStep3Valid: () => boolean
  isStep4Valid: () => boolean
  resetTrip: () => void
}

// --- sessionStorage Helpers ---

const STORAGE_KEY = "routescout_trip_plan"

function loadFromStorage(): TripPlanData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (typeof parsed.startLocation !== "string") return null
    if (!Array.isArray(parsed.routeOptions)) return null
    return parsed as unknown as TripPlanData
  } catch {
    return null
  }
}

function saveToStorage(state: TripPlanData): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Silently ignore QuotaExceededError or unavailable storage
  }
}

// --- Initial State ---

const initialState: TripPlanData = {
  startLocation: "",
  endLocation: "",
  startLatLng: null,
  endLatLng: null,
  budget: "0-50",
  rankPreference: "POPULARITY",
  searchRadius: "5",
  routeOptions: [],
  selectedRoute: null,
  selectedInterests: [],
  availableStops: [],
  selectedStops: [],
  stopFilters: { minRating: 0, maxPriceLevel: 0, maxDistanceMiles: 0, categoryIds: [] },
  totalDistanceMiles: 0,
  totalDriveTime: "",
  tripId: null,
}

// --- Reducer ---

function tripPlanReducer(state: TripPlanData, action: TripPlanAction): TripPlanData {
  switch (action.type) {
    case "SET_STARTING_POINT":
      return { ...state, startLocation: action.payload }
    case "SET_DESTINATION":
      return { ...state, endLocation: action.payload }
    case "SET_START_LATLNG":
      return { ...state, startLatLng: action.payload }
    case "SET_END_LATLNG":
      return { ...state, endLatLng: action.payload }
    case "SET_BUDGET":
      return { ...state, budget: action.payload }
    case "SET_RANK_PREFERENCE":
      return { ...state, rankPreference: action.payload }
    case "SET_SEARCH_RADIUS":
      return { ...state, searchRadius: action.payload }
    case "SET_ROUTE_OPTIONS":
      return { ...state, routeOptions: action.payload }
    case "SET_SELECTED_ROUTE":
      return { ...state, selectedRoute: action.payload }
    case "SET_SELECTED_INTERESTS":
      return { ...state, selectedInterests: action.payload }
    case "SET_AVAILABLE_STOPS":
      return { ...state, availableStops: action.payload }
    case "SET_SELECTED_STOPS":
      return { ...state, selectedStops: action.payload }
    case "SET_STOP_FILTERS":
      return { ...state, stopFilters: action.payload }
    case "SET_ROUTE_STATS":
      return { ...state, totalDistanceMiles: action.payload.distanceMiles, totalDriveTime: action.payload.driveTime }
    case "SET_TRIP_ID":
      return { ...state, tripId: action.payload }
    case "SWAP_LOCATIONS":
      return {
        ...state,
        startLocation: state.endLocation,
        endLocation: state.startLocation,
        startLatLng: state.endLatLng,
        endLatLng: state.startLatLng,
      }
    case "RESET":
      return initialState
    default:
      return state
  }
}

// --- Context ---

const TripPlanContext = createContext<TripPlanContextType | undefined>(undefined)

// --- Provider ---

export function TripPlanProvider({ children, initialState: seedState }: { children: ReactNode; initialState?: TripPlanData }) {
  const [state, dispatch] = useReducer(
    tripPlanReducer,
    initialState,
    (init): TripPlanData => seedState ?? loadFromStorage() ?? init,
  )

  useEffect(() => {
    saveToStorage(state)
  }, [state])

  const isStep1Valid = (): boolean =>
    state.startLocation.trim() !== "" && state.endLocation.trim() !== ""

  const isStep2Valid = (): boolean =>
    state.selectedRoute !== null

  const isStep3Valid = (): boolean =>
    state.selectedInterests.length > 0

  const isStep4Valid = (): boolean =>
    state.selectedStops.length > 0

  const resetTrip = (): void => {
    sessionStorage.removeItem(STORAGE_KEY)
    dispatch({ type: "RESET" })
  }

  return (
    <TripPlanContext.Provider
      value={{ state, dispatch, isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid, resetTrip }}
    >
      {children}
    </TripPlanContext.Provider>
  )
}

// --- Hook ---

// eslint-disable-next-line react-refresh/only-export-components
export function useTripPlan() {
  const context = useContext(TripPlanContext)
  if (context === undefined) {
    throw new Error("useTripPlan must be used within a TripPlanProvider")
  }
  return context
}
