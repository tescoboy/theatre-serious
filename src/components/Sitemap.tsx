import { LinkTo } from './LinkTo'
import { getSitemap } from '../routes.config'

export function Sitemap() {
  const sitemapRoutes = getSitemap()

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Site Map</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sitemapRoutes.map(route => (
          <div key={route.id} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{route.label}</h3>
            <LinkTo 
              id={route.id} 
              className="text-blue-600 hover:underline text-sm"
            >
              Visit {route.label}
            </LinkTo>
          </div>
        ))}
      </div>
    </div>
  )
} 