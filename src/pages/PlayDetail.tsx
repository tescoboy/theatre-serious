import { LinkTo } from '../components/LinkTo'
import { Breadcrumbs } from '../components/Breadcrumbs'

export function PlayDetail() {
  // For now, use a placeholder slug
  const slug = 'hamlet-almeida'

  return (
    <div>
      <Breadcrumbs currentRouteId="plays.detail" />
      
      <h1 className="text-3xl font-bold mb-6">Play Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Play: {slug}</h2>
        <p className="text-gray-600">Detailed information about this play will appear here.</p>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Reviews</h3>
          <LinkTo 
            id="reviews.detail" 
            params={{ year: '2025', slug: slug }}
            className="text-blue-600 hover:underline"
          >
            View Review
          </LinkTo>
        </div>
      </div>
    </div>
  )
} 