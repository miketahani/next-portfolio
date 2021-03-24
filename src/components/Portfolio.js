// Simple test to add more points to an existing voronoi diagram
import { useState, useCallback, useRef } from 'react'

import { useObserver } from '../hooks/useObserver'

import Visualization from './Visualization'

export default function Portfolio () {
  const [page, setPage] = useState(0)
  const observerTargetNode = useRef()

  const nextPage = useCallback(() => setPage(prevPage => prevPage + 1), [])
  useObserver(observerTargetNode, nextPage)

  return (
    <>
      <Visualization page={page} />

      <div id="ObserverTarget" ref={observerTargetNode} />
    </>
  )
}
