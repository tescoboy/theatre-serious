import { Outlet } from '@tanstack/react-router'
import { NavLink } from './LinkTo'
import { getSitemap } from '../routes.config'

export function RootLayout() {
  const navRoutes = getSitemap()

  return (
    <div className="app">
      <header className="bg-red-600 text-white p-4">
        <nav className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Serious THEATRE</h1>
            <div className="flex space-x-4">
              {navRoutes.map(route => (
                <NavLink 
                  key={route.id} 
                  id={route.id}
                  className="hover:text-gray-200 transition-colors"
                >
                  {route.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
} 