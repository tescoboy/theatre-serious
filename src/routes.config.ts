export interface RouteConfig {
  id: string
  path: string
  label: string
  parent?: string
}

export const routes: RouteConfig[] = [
  {
    id: 'home',
    path: '/',
    label: 'Dashboard'
  },
  {
    id: 'plays.index',
    path: '/plays',
    label: 'All Plays'
  },
  {
    id: 'plays.detail',
    path: '/plays/$slug',
    label: 'Play Details',
    parent: 'plays.index'
  },
  {
    id: 'calendar',
    path: '/calendar',
    label: 'Calendar'
  },
  {
    id: 'plays.upcoming',
    path: '/plays/upcoming',
    label: 'Upcoming Plays',
    parent: 'plays.index'
  },
  {
    id: 'plays.past',
    path: '/plays/past',
    label: 'Past Plays',
    parent: 'plays.index'
  },
  {
    id: 'plays.unrated',
    path: '/plays/unrated',
    label: 'Unrated Plays',
    parent: 'plays.index'
  },
  {
    id: 'reviews.index',
    path: '/reviews',
    label: 'Reviews'
  },
  {
    id: 'reviews.detail',
    path: '/reviews/$year/$slug',
    label: 'Review Details',
    parent: 'reviews.index'
  },
  {
    id: 'hall.fame',
    path: '/hall-of-fame',
    label: 'Hall of Fame'
  },
  {
    id: 'admin.addPlay',
    path: '/add-play',
    label: 'Add Play'
  }
]

export function findRoute(id: string): RouteConfig | undefined {
  return routes.find(route => route.id === id)
}

export function getBreadcrumbs(routeId: string): RouteConfig[] {
  const breadcrumbs: RouteConfig[] = []
  let currentRoute = findRoute(routeId)
  
  while (currentRoute) {
    breadcrumbs.unshift(currentRoute)
    currentRoute = currentRoute.parent ? findRoute(currentRoute.parent) : undefined
  }
  
  return breadcrumbs
}

export function getSitemap(): RouteConfig[] {
  return routes.filter(route => !route.path.includes('$'))
} 