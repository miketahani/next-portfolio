import { useRef, useEffect } from 'react'

export function useObserver (targetNode, callback) {
  const observer = useRef()

  useEffect(() => {
    const node = targetNode.current
    if (!node) return;

    observer.current = new IntersectionObserver(entries =>
      entries[0].intersectionRatio > 0 && callback(entries)
    )
    observer.current.observe(node)

    return () => observer.current.unobserve(node)
  }, [targetNode, callback])

  return observer.current
}
