import { LinkTo } from './LinkTo'
import { getBreadcrumbs } from '../routes.config'

interface BreadcrumbsProps {
  currentRouteId: string
}

export function Breadcrumbs({ currentRouteId }: BreadcrumbsProps) {
  const breadcrumbs = getBreadcrumbs(currentRouteId)

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((route, index) => (
          <li key={route.id} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-600 font-medium">{route.label}</span>
            ) : (
              <LinkTo 
                id={route.id} 
                className="text-blue-600 hover:underline"
              >
                {route.label}
              </LinkTo>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
} 