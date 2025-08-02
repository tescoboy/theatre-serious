import { LinkTo } from '../components/LinkTo'

export function AllPlays() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Plays</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600 mb-4">All your theatre plays will be displayed here.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Example play cards */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Hamlet</h3>
            <p className="text-sm text-gray-600">Almeida Theatre</p>
            <LinkTo id="plays.detail" params={{ slug: 'hamlet-almeida' }}>
              View Details
            </LinkTo>
          </div>
        </div>
      </div>
    </div>
  )
} 