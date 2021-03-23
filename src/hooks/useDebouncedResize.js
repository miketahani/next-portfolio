import { useState, useEffect } from 'react'
import { debounce } from '../util'

export function useDebouncedResize (duration = 250, targetNode = window) {
  const [dimensions, setDimensions] = useState([targetNode.innerWidth, targetNode.innerHeight])

  useEffect(() => {
    const resize = debounce(() => setDimensions([targetNode.innerWidth, targetNode.innerHeight]), duration)
    targetNode.addEventListener('resize', resize)
    return () => targetNode.removeEventListener('resize', resize)
  }, [duration, targetNode])

  return dimensions
}
