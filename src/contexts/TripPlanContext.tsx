import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

// --- Types ---

export interface LatLng {
  lat: number
  lng: number
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
}

export interface TripPlanData {
  // Step 1: Locations & Preferences
  startLocation: string       // was: startingPoint
  endLocation: string         // was: destination
  startLatLng: LatLng | null
  endLatLng: LatLng | null
  budget: string
  duration: string
  travelPace: string          // was: pace

  // Step 2: Interests
  selectedInterests: string[]

  // Step 3: Suggested Stops
  availableStops: Place[]
  selectedStops: Place[]      // was: string[]

  // Route stats (set after Routes API call)
  totalDistanceMiles: number
  totalDriveTime: string
}

// --- Action Types ---

type TripPlanAction =
  | { type: "SET_STARTING_POINT"; payload: string }       // writes to startLocation
  | { type: "SET_DESTINATION"; payload: string }           // writes to endLocation
  | { type: "SET_START_LATLNG"; payload: LatLng | null }
  | { type: "SET_END_LATLNG"; payload: LatLng | null }
  | { type: "SET_BUDGET"; payload: string }
  | { type: "SET_DURATION"; payload: string }
  | { type: "SET_PACE"; payload: string }                  // writes to travelPace
  | { type: "SET_SELECTED_INTERESTS"; payload: string[] }
  | { type: "SET_AVAILABLE_STOPS"; payload: Place[] }
  | { type: "SET_SELECTED_STOPS"; payload: Place[] }
  | { type: "SET_ROUTE_STATS"; payload: { distanceMiles: number; driveTime: string } }
  | { type: "SWAP_LOCATIONS" }
  | { type: "RESET" }

// --- Context Type ---

interface TripPlanContextType {
  state: TripPlanData
  dispatch: React.Dispatch<TripPlanAction>
  isStep1Valid: () => boolean
  isStep2Valid: () => boolean
  isStep3Valid: () => boolean
  resetTrip: () => void
}

// --- sessionStorage Helpers ---

const STORAGE_KEY = "routescout_trip_plan"

function loadFromStorage(): TripPlanData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Record<string, unknown>
    // Guard against stale data from before the field rename
    if (typeof parsed.startLocation !== "string") return null
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
  duration: "1",
  travelPace: "",
  selectedInterests: [],
  availableStops: [],
  selectedStops: [],
  totalDistanceMiles: 0,
  totalDriveTime: "",
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
    case "SET_DURATION":
      return { ...state, duration: action.payload }
    case "SET_PACE":
      return { ...state, travelPace: action.payload }
    case "SET_SELECTED_INTERESTS":
      return { ...state, selectedInterests: action.payload }
    case "SET_AVAILABLE_STOPS":
      return { ...state, availableStops: action.payload }
    case "SET_SELECTED_STOPS":
      return { ...state, selectedStops: action.payload }
    case "SET_ROUTE_STATS":
      return { ...state, totalDistanceMiles: action.payload.distanceMiles, totalDriveTime: action.payload.driveTime }
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

export function TripPlanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    tripPlanReducer,
    initialState,
    (init): TripPlanData => loadFromStorage() ?? init,
  )

  useEffect(() => {
    saveToStorage(state)
  }, [state])

  const isStep1Valid = (): boolean =>
    state.startLocation.trim() !== "" && state.endLocation.trim() !== ""

  const isStep2Valid = (): boolean =>
    state.selectedInterests.length > 0

  const isStep3Valid = (): boolean =>
    state.selectedStops.length > 0

  const resetTrip = (): void => {
    sessionStorage.removeItem(STORAGE_KEY)
    dispatch({ type: "RESET" })
  }

  return (
    <TripPlanContext.Provider
      value={{ state, dispatch, isStep1Valid, isStep2Valid, isStep3Valid, resetTrip }}
    >
      {children}
    </TripPlanContext.Provider>
  )
}

// --- Hook ---

export function useTripPlan() {
  const context = useContext(TripPlanContext)
  if (context === undefined) {
    throw new Error("useTripPlan must be used within a TripPlanProvider")
  }
  return context
}
