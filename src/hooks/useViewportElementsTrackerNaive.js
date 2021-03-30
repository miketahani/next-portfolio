import { useState, useEffect, useRef } from 'react'

import { debounce } from '../util'

const IDENTITY_FN = d => d;

export default function useViewportElementsTrackerNaive (
  rootElement,
  selector,
  accessor = IDENTITY_FN
) {
  const [inViewport, setInViewport] = useState([])
  const observer = useRef()

  // Track scroll position because new nodes get added on scroll
  const [scrollPosition, setScrollPosition] = useState(window.scrollY)
  useEffect(() => {
    const handleScroll = debounce(() => setScrollPosition(window.scrollY), 250)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!rootElement.current) return;

    observer.current = new IntersectionObserver(entries => {
      setInViewport(prevInViewport => {
        let inViewport = new Set(prevInViewport)
        // Add intersecting nodes, delete non-intersecting nodes
        for (let entry of entries) {
          const id = accessor(entry)
          inViewport[entry.isIntersecting ? 'add' : 'delete'](id)
        }
        return [...inViewport]
      })
    })

    const nodes = Array.from(rootElement.current.querySelectorAll(selector))
    nodes.forEach(node => observer.current.observe(node))
    return () => nodes.forEach(node => observer.current.unobserve(node))
  }, [rootElement, selector, accessor, scrollPosition])

  return inViewport
}
