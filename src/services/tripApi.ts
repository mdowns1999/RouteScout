import type { TripPlanData } from "../contexts/TripPlanContext"

const BASE = "https://routescoutbackend.onrender.com"

type TripPayload = Omit<TripPlanData, "availableStops" | "tripId" | "routeOptions" | "selectedRoute" | "stopFilters">

export async function createTrip(data: TripPlanData): Promise<string> {
  // Strip ephemeral/frontend-only fields before sending
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { availableStops: _a, tripId: _t, routeOptions: _ro, selectedRoute: _sr, stopFilters: _sf, ...payload } = data

  const res = await fetch(`${BASE}/api/trips/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload satisfies TripPayload),
  })

  if (!res.ok) {
    throw new Error(`Failed to save trip: ${res.status}`)
  }

  const json = await res.json() as { tripId?: string; _id?: string }
  const id = json.tripId ?? json._id
  if (!id) throw new Error("No tripId in response")
  return id
}

export async function getShareTrip(id: string): Promise<TripPlanData> {
  const res = await fetch(`${BASE}/api/trips/${id}/share`)

  if (!res.ok) {
    if (res.status === 404) throw new Error("Trip not found")
    throw new Error(`Failed to load trip: ${res.status}`)
  }

  const json = await res.json() as TripPlanData & { tripId?: string; _id?: string }
  return {
    ...json,
    availableStops: [],
    routeOptions: [],
    selectedRoute: null,
    stopFilters: { minRating: 0, maxPriceLevel: 0, maxDistanceMiles: 0, categoryIds: [] },
    tripId: json.tripId ?? json._id ?? null,
  } as TripPlanData
}
