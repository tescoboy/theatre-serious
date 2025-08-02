import { LinkTo } from '../components/LinkTo'

export function Reviews() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reviews</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600 mb-4">All your theatre reviews will be displayed here.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Example review cards */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Hamlet Review</h3>
            <p className="text-sm text-gray-600">Almeida Theatre - 2025</p>
            <LinkTo 
              id="reviews.detail" 
              params={{ year: '2025', slug: 'hamlet-almeida' }}
              className="text-blue-600 hover:underline"
            >
              Read Review
            </LinkTo>
          </div>
        </div>
      </div>
    </div>
  )
} 