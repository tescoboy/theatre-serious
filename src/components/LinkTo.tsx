import React from 'react'
import { Link } from '@tanstack/react-router'
import { buildPath, validateRouteId } from '../utils/path'
import { getRouteLabel } from '../utils/routes'

interface LinkToProps {
  id: string
  params?: Record<string, string>
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function LinkTo({ id, params = {}, children, className, onClick }: LinkToProps) {
  if (!validateRouteId(id)) {
    console.error(`Invalid route ID: ${id}`)
    return <span className={className}>{children}</span>
  }

  const to = buildPath(id, params)

  return (
    <Link 
      to={to} 
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

// Helper component for navigation links
export function NavLink({ id, params = {}, children, className }: LinkToProps) {
  return (
    <LinkTo id={id} params={params} className={className}>
      {children || getRouteLabel(id)}
    </LinkTo>
  )
} 