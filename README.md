# Serious THEATRE - Vite + React TS with @tanstack/react-router

A sophisticated theatre play tracking application built with Vite, React TypeScript, and @tanstack/react-router.

## Features

- **Single Source of Truth**: All routes defined in `src/routes.config.ts`
- **Type-Safe Routing**: No string hrefs, all links use `<LinkTo id params>`
- **Breadcrumbs**: Automatic breadcrumb generation from route config
- **Sitemap**: Dynamic sitemap generation excluding dynamic routes
- **Slug Helpers**: Utilities for creating human-friendly URLs

## Route Structure

| Route ID | Path | Label | Parent |
|----------|------|-------|--------|
| `home` | `/` | Dashboard | - |
| `plays.index` | `/plays` | All Plays | - |
| `plays.detail` | `/plays/$slug` | Play Details | `plays.index` |
| `calendar` | `/calendar` | Calendar | - |
| `plays.upcoming` | `/plays/upcoming` | Upcoming Plays | `plays.index` |
| `plays.past` | `/plays/past` | Past Plays | `plays.index` |
| `plays.unrated` | `/plays/unrated` | Unrated Plays | `plays.index` |
| `reviews.index` | `/reviews` | Reviews | - |
| `reviews.detail` | `/reviews/$year/$slug` | Review Details | `reviews.index` |
| `hall.fame` | `/hall-of-fame` | Hall of Fame | - |
| `admin.addPlay` | `/add-play` | Add Play | - |

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**: Navigate to `http://localhost:3000`

## Usage Examples

### Linking to Routes

```tsx
// Basic link
<LinkTo id="plays.index">All Plays</LinkTo>

// With parameters
<LinkTo id="plays.detail" params={{ slug: "hamlet-almeida" }}>
  View Hamlet
</LinkTo>

// Review with year and slug
<LinkTo 
  id="reviews.detail" 
  params={{ year: "2025", slug: "hamlet-almeida" }}
>
  Read Review
</LinkTo>
```

### Slug Generation

```tsx
import { slugify, playSlug, reviewSlug } from './utils/path'

// Basic slugification
slugify("Hamlet - Almeida Theatre") // "hamlet-almeida-theatre"

// Play slug
playSlug("Hamlet", "Almeida Theatre") // "hamlet-almeida-theatre"

// Review slug
reviewSlug("Hamlet", "Almeida Theatre") // "hamlet-almeida-theatre"
```

### Breadcrumbs

```tsx
import { Breadcrumbs } from './components/Breadcrumbs'

// Automatic breadcrumbs based on current route
<Breadcrumbs currentRouteId="plays.detail" />
// Renders: Dashboard / All Plays / Play Details
```

## Adding New Routes

To add a new section:

1. **Add to routes config** (`src/routes.config.ts`):
   ```tsx
   {
     id: 'new.section',
     path: '/new-section',
     label: 'New Section',
     parent: 'optional.parent'
   }
   ```

2. **Register route** (`src/router.tsx`):
   ```tsx
   const newSectionRoute = createRoute({
     getParentRoute: () => rootRoute,
     path: toTanStackPath('new.section'),
     component: NewSection,
   })
   ```

3. **Create page component** (`src/pages/NewSection.tsx`):
   ```tsx
   export function NewSection() {
     return <div>New Section Content</div>
   }
   ```

4. **Use in navigation**: The route automatically appears in navigation and sitemap.

## File Structure

```
src/
├── components/
│   ├── LinkTo.tsx          # Type-safe link component
│   ├── Breadcrumbs.tsx     # Breadcrumb navigation
│   ├── Sitemap.tsx         # Sitemap component
│   └── RootLayout.tsx      # Main layout
├── pages/                  # Page components
├── utils/
│   ├── path.ts            # Path utilities and slug helpers
│   └── routes.ts          # Route utilities
├── routes.config.ts       # Single source of truth for routes
├── router.tsx             # TanStack Router configuration
└── main.tsx              # App entry point
```

## Quality Checks

- ✅ TypeScript clean
- ✅ `npm run dev` works
- ✅ Breadcrumbs render on detail pages
- ✅ Sitemap excludes dynamic routes
- ✅ No string hrefs in JSX
- ✅ All links use `<LinkTo id params>`

## Development

- **Type checking**: `npm run build`
- **Linting**: `npm run lint`
- **Preview**: `npm run preview`

## Technologies

- **Vite**: Fast build tool
- **React 18**: UI library
- **TypeScript**: Type safety
- **@tanstack/react-router**: Client-side routing
- **Tailwind CSS**: Utility-first styling 