// Simple test to add more points to an existing voronoi diagram
import { useState, useEffect, useCallback, useRef } from 'react'

import { useObserver } from '../hooks/useObserver'

import Visualization from './Visualization'

export default function Portfolio () {
  const [page, setPage] = useState(0)
  const observerTargetNode = useRef()

  // FIXME Hack to update the target node value of `useObserver` because it's a ref
  const [isObserverTargetMounted, setIsMounted] = useState(false)
  useEffect(() => { observerTargetNode.current && !isObserverTargetMounted && setIsMounted(true) })

  const nextPage = useCallback(() => setPage(prevPage => prevPage + 1), [])
  useObserver(observerTargetNode.current, nextPage)

  return (
    <>
      <Visualization page={page} />

      <div id="ObserverTarget" ref={observerTargetNode} />
    </>
  )
}
