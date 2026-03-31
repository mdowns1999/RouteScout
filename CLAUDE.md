# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check (no auto-fix)
npm run test         # Run Jest once
npm run test:watch   # Jest in watch mode
```

To run a single test file: `npx jest src/path/to/file.test.tsx`

## Environment

A `VITE_GOOGLE_MAPS_API_KEY` environment variable is required for the Map component to work.

## Architecture

RouteScout is a multi-step trip planning wizard built with React 19, TypeScript, Vite, React Router 7, and MUI 7. The app is deployed at basename `/route-scout`.

**App boot chain**: `main.tsx` → `Root.tsx` (theme + TripPlanProvider) → `App.tsx` (router) → `layout/Root.tsx` (Header/Footer shell)

**Routes**:
- `/` — LandingPage
- `/trip` — 4-step wizard (TripPage)
- `/trip/export` — TripExport

**State management**: A single `TripPlanContext` (Context + useReducer) in `src/contexts/TripPlanContext.tsx` holds all wizard state across steps. The `TripPlanData` interface covers locations/preferences (step 1), selected interest categories (step 2), and selected stop IDs (step 3). Validation helpers `isStep1Valid()` / `isStep2Valid()` / `isStep3Valid()` are exposed from the context.

**Wizard steps** (all under `src/pages/TripPage/`):
1. `LocationsView` — start/destination, budget, duration, pace
2. `InterestsView` — 10 interest categories
3. `SuggestedStops` — interactive Google Map with selectable stops
4. `TripSummary` — review before export

**UI primitives** live in `src/components/UI/` (`Heading`, `Paragraph`, `LayoutBand`, `Separator`, `Row`, `Image`) and each has a `.test.tsx` alongside it.

**Theme**: Defined in `src/theme.tsx` with a travel color scheme (Ocean Blue primary, Palm Green secondary). Light/dark mode is toggled via `ThemeModeContext` and persisted to localStorage.

**Mobile detection**: `useIsMobile()` hook (breakpoint <768px) is used for responsive layout adjustments.

## Testing notes

Jest uses `ts-jest` with `jsdom`. `src/test/setup.ts` provides polyfills and mocks for `window.matchMedia`, `localStorage`, and `IntersectionObserver` (required by MUI and React Router 7). Tests live alongside source files.

## Code style

ESLint enforces `semi: never` (no semicolons).
