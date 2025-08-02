import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { toTanStackPath } from './utils/path'

// Import all page components
import { Dashboard } from './pages/Dashboard'
import { AllPlays } from './pages/AllPlays'
import { PlayDetail } from './pages/PlayDetail'
import { Calendar } from './pages/Calendar'
import { UpcomingPlays } from './pages/UpcomingPlays'
import { PastPlays } from './pages/PastPlays'
import { UnratedPlays } from './pages/UnratedPlays'
import { Reviews } from './pages/Reviews'
import { ReviewDetail } from './pages/ReviewDetail'
import { HallOfFame } from './pages/HallOfFame'
import { AddPlay } from './pages/AddPlay'
import { RootLayout } from './components/RootLayout'

// Create root route
const rootRoute = createRootRoute({
  component: RootLayout,
})

// Create all routes from config
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('home'),
  component: Dashboard,
})

const playsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('plays.index'),
  component: AllPlays,
})

const playsDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('plays.detail'),
  component: PlayDetail,
})

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('calendar'),
  component: Calendar,
})

const playsUpcomingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('plays.upcoming'),
  component: UpcomingPlays,
})

const playsPastRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('plays.past'),
  component: PastPlays,
})

const playsUnratedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('plays.unrated'),
  component: UnratedPlays,
})

const reviewsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('reviews.index'),
  component: Reviews,
})

const reviewsDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('reviews.detail'),
  component: ReviewDetail,
})

const hallFameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('hall.fame'),
  component: HallOfFame,
})

const adminAddPlayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: toTanStackPath('admin.addPlay'),
  component: AddPlay,
})

// Create route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  playsIndexRoute,
  playsDetailRoute,
  calendarRoute,
  playsUpcomingRoute,
  playsPastRoute,
  playsUnratedRoute,
  reviewsIndexRoute,
  reviewsDetailRoute,
  hallFameRoute,
  adminAddPlayRoute,
])

// Create router
export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
} 