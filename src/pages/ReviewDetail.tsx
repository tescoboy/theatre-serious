import { LinkTo } from '../components/LinkTo'
import { Breadcrumbs } from '../components/Breadcrumbs'

export function ReviewDetail() {
  // For now, use placeholder values
  const year = '2025'
  const slug = 'hamlet-almeida'

  return (
    <div>
      <Breadcrumbs currentRouteId="reviews.detail" />
      
      <h1 className="text-3xl font-bold mb-6">Review Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Review: {slug} ({year})</h2>
        <p className="text-gray-600">Detailed review content will appear here.</p>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Related Play</h3>
          <LinkTo 
            id="plays.detail" 
            params={{ slug: slug }}
            className="text-blue-600 hover:underline"
          >
            View Play Details
          </LinkTo>
        </div>
      </div>
    </div>
  )
} 