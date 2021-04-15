import { useState, useEffect, useRef, useCallback } from 'react'

import useScrollPosition from '../hooks/useScrollPosition'

const IDENTITY_FN = d => d;

export default function useViewportElementsTracker (selector, accessor = IDENTITY_FN) {
  const [inViewport, setInViewport] = useState([])
  const observer = useRef()

  // Track scroll position because new nodes get added on scroll
  const scrollPosition = useScrollPosition(250)

  const rootElementRef = useRef(null)
  /**
   * This is a "ref callback" used instead of a ref inside a useEffect, because
   * the parent may need to run through several rerenders before rendering
   * the trigger DOM nodes that we observe below, and we need to operate on the
   * DOM /after/ those rerenders.
   * See: https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
   *
   * Note that we add the scrollPosition as a dependency even though it is not
   * used inside the callback, because new nodes are added on scroll.
   */
  const setRootElementRef = useCallback(node => {
    // Clean up (what would normally be the callback returned from useEffect)
    if (rootElementRef.current) {
      const nodes = Array.from(rootElementRef.current.querySelectorAll(selector))
      nodes.forEach(node => observer.current.unobserve(node))
    }

    // Check if node was passed
    if (node) {
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

      const nodes = Array.from(node.querySelectorAll(selector))
      nodes.forEach(node => observer.current.observe(node))
    }

    // Save ref
    rootElementRef.current = node
  }, [selector, accessor, scrollPosition])

  return [setRootElementRef, inViewport]
}
