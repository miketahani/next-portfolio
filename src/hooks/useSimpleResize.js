import React, { useState, useEffect } from 'react'

export function useSimpleResize (targetNode = window) {
  const [dimensions, setDimensions] = useState([targetNode.innerWidth, targetNode.innerHeight])

  useEffect(() => {
    const resize = () => setDimensions([targetNode.innerWidth, targetNode.innerHeight])
    targetNode.addEventListener('resize', resize)
    return () => targetNode.removeEventListener('resize', resize)
  }, [targetNode])

  return dimensions
}
