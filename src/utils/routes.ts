import { findRoute, getBreadcrumbs, getSitemap } from '../routes.config'

export { findRoute, getBreadcrumbs, getSitemap }

export function validateRouteId(routeId: string): boolean {
  return findRoute(routeId) !== undefined
}

export function getRouteLabel(routeId: string): string | undefined {
  const route = findRoute(routeId)
  return route?.label
}

export function getRoutePath(routeId: string): string | undefined {
  const route = findRoute(routeId)
  return route?.path
} 