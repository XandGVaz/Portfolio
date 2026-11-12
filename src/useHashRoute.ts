import { useEffect, useState } from 'react'

// Roteamento por hash, que funciona no GitHub Pages sem servidor:
//   #/journey/<slug>  → subpágina da jornada
//   qualquer outro    → página inicial (#about, #projects… continuam sendo âncoras;
//                       em "#projects/iot", a âncora é "projects" e "iot" é um filtro)
export type Route = { page: 'home'; anchor: string | null } | { page: 'journey'; slug: string }

function parse(hash: string): Route {
  const m = hash.match(/^#\/journey\/([\w-]+)\/?$/)
  if (m) return { page: 'journey', slug: m[1] }
  return { page: 'home', anchor: hash.length > 1 && !hash.startsWith('#/') ? hash.slice(1).split('/')[0] : null }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  // Depois de trocar de página: subpágina abre no topo; na inicial, rola até a âncora.
  // A rolagem espera um quadro para o React terminar de montar a página.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (route.page === 'journey') window.scrollTo({ top: 0, behavior: 'instant' })
      else if (route.anchor) document.getElementById(route.anchor)?.scrollIntoView({ behavior: 'instant' })
    })
    return () => cancelAnimationFrame(id)
  }, [route])

  return route
}
