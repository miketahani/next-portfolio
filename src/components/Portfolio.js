// Simple test to add more points to an existing voronoi diagram
import { useState, useCallback, useRef } from 'react'

import { useObserver } from '../hooks/useObserver'

import Visualization from './Visualization'

import imageManifest, { postsById } from '../util/loadManifest'

export default function Portfolio () {
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState(false)

  const observerTargetNode = useRef()

  const nextPage = useCallback(() => setPage(prevPage => prevPage + 1), [])
  useObserver(observerTargetNode, nextPage)

  // If there's existing modal content, close the modal; else set the content data
  //   to the passed-in item index (which should correspond to the fileId)
  const toggleModal = portfolioItemIndex =>
    setModal(modal !== false ? false : imageManifest[portfolioItemIndex])

  return (
    <>
      <Visualization
        page={page}
        imageManifest={imageManifest}
        onSelectPortfolioItem={toggleModal}
      />

      <div id="ObserverTarget" ref={observerTargetNode} />

      {!!modal && null}
    </>
  )
}
