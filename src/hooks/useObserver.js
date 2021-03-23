import { useRef, useEffect } from 'react'

export function useObserver (targetNode, callback) {
  const observer = useRef()

  useEffect(() => {
    if (!targetNode) return;

    observer.current = new IntersectionObserver(entries =>
      entries[0].intersectionRatio > 0 && callback(entries)
    )
    observer.current.observe(targetNode)

    return () => observer.current.unobserve(targetNode)
  }, [targetNode, callback])

  return observer.current
}
