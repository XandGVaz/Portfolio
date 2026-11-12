import { useEffect, useState } from 'react'

export type Route = { page: 'home'; anchor: string | null } | { page: 'journey'; slug: string; section: string | null }

function parse(hash: string): Route {
  const m = hash.match(/^#\/journey\/([\w-]+)(?:\/([\w-]+))?\/?$/)
  if (m) return { page: 'journey', slug: m[1], section: m[2] ?? null }
  return { page: 'home', anchor: hash.length > 1 && !hash.startsWith('#/') ? hash.slice(1).split('/')[0] : null }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (route.page === 'journey') window.scrollTo({ top: 0, behavior: 'instant' })
      else if (route.anchor) document.getElementById(route.anchor)?.scrollIntoView({ behavior: 'instant' })
    })
    return () => cancelAnimationFrame(id)
  }, [route])

  return route
}
