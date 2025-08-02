import { findRoute } from '../routes.config'

export function buildPath(routeId: string, params: Record<string, string> = {}): string {
  const route = findRoute(routeId)
  if (!route) {
    throw new Error(`Route not found: ${routeId}`)
  }
  
  let path = route.path
  
  // Replace dynamic parameters
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`$${key}`, value)
  })
  
  return path
}

export function toTanStackPath(routeId: string): string {
  const route = findRoute(routeId)
  if (!route) {
    throw new Error(`Route not found: ${routeId}`)
  }
  
  return route.path
}

export function validateRouteId(routeId: string): boolean {
  return findRoute(routeId) !== undefined
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function playSlug(title: string, venue: string): string {
  const baseSlug = slugify(`${title}-${venue}`)
  return baseSlug
}

export function reviewSlug(playTitle: string, venue: string): string {
  return playSlug(playTitle, venue)
}

export function ensureUniqueSlug(
  baseSlug: string, 
  existingSlugs: string[], 
  shortId: string
): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }
  
  return `${baseSlug}-${shortId}`
} 