import { createContext, useContext, useReducer, type ReactNode } from "react"

// Types
export interface TripPlanData {
  // Step 1: Locations & Preferences
  startingPoint: string;
  destination: string;
  budget: string;
  duration: string;
  pace: string;

  // Step 2: Interests
  selectedInterests: string[];

  // Step 3: Suggested Stops
  selectedStops: string[];
}

// Action Types
type TripPlanAction =
  | { type: "SET_STARTING_POINT"; payload: string }
  | { type: "SET_DESTINATION"; payload: string }
  | { type: "SET_BUDGET"; payload: string }
  | { type: "SET_DURATION"; payload: string }
  | { type: "SET_PACE"; payload: string }
  | { type: "SET_SELECTED_INTERESTS"; payload: string[] }
  | { type: "SET_SELECTED_STOPS"; payload: string[] }
  | { type: "SWAP_LOCATIONS" }
  | { type: "RESET" };

interface TripPlanContextType {
  state: TripPlanData;
  dispatch: React.Dispatch<TripPlanAction>;

  // Validation functions
  isStep1Valid: () => boolean;
  isStep2Valid: () => boolean;
  isStep3Valid: () => boolean;
}

const initialState: TripPlanData = {
  startingPoint: "",
  destination: "",
  budget: "0-50",
  duration: "1",
  pace: "",
  selectedInterests: [],
  selectedStops: [],
}

// Reducer
function tripPlanReducer(
  state: TripPlanData,
  action: TripPlanAction,
): TripPlanData {
  switch (action.type) {
    case "SET_STARTING_POINT":
      return { ...state, startingPoint: action.payload }
    case "SET_DESTINATION":
      return { ...state, destination: action.payload }
    case "SET_BUDGET":
      return { ...state, budget: action.payload }
    case "SET_DURATION":
      return { ...state, duration: action.payload }
    case "SET_PACE":
      return { ...state, pace: action.payload }
    case "SET_SELECTED_INTERESTS":
      return { ...state, selectedInterests: action.payload }
    case "SET_SELECTED_STOPS":
      return { ...state, selectedStops: action.payload }
    case "SWAP_LOCATIONS":
      return {
        ...state,
        startingPoint: state.destination,
        destination: state.startingPoint,
      }
    case "RESET":
      return initialState
    default:
      return state
  }
}

const TripPlanContext = createContext<TripPlanContextType | undefined>(
  undefined,
)

export function TripPlanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripPlanReducer, initialState)

  // Validation functions
  const isStep1Valid = (): boolean => {
    return state.startingPoint.trim() !== "" && state.destination.trim() !== ""
  }

  const isStep2Valid = (): boolean => {
    return state.selectedInterests.length > 0
  }

  const isStep3Valid = (): boolean => {
    return state.selectedStops.length > 0
  }

  return (
    <TripPlanContext.Provider
      value={{
        state,
        dispatch,
        isStep1Valid,
        isStep2Valid,
        isStep3Valid,
      }}
    >
      {children}
    </TripPlanContext.Provider>
  )
}

export function useTripPlan() {
  const context = useContext(TripPlanContext)
  if (context === undefined) {
    throw new Error("useTripPlan must be used within a TripPlanProvider")
  }
  return context
}
