// Simple test to add more points to an existing voronoi diagram
import { useState, useCallback, useRef } from 'react'

import { useObserver } from '../hooks/useObserver'

import ImageDetailModal from './ImageDetailModal'
import Visualization from './Visualization'

import imageManifest, { postsById } from '../util/loadManifest'

export default function Portfolio () {
  // Infinite scroll
  const observerTargetNode = useRef()
  const [page, setPage] = useState(0)
  const nextPage = useCallback(() => setPage(prevPage => prevPage + 1), [])
  useObserver(observerTargetNode, nextPage)

  // Modal
  const [modal, setModal] = useState(false)
  // Memoize `openModal` to prevent unnecessary <Visualization> rerenders
  const openModal = useCallback(portfolioItemIndex => setModal(imageManifest[portfolioItemIndex]), [])
  const closeModal = () => setModal(false)

  return (
    <>
      <Visualization
        page={page}
        imageManifest={imageManifest}
        onSelectPortfolioItem={openModal}
      />

      <div id="ObserverTarget" ref={observerTargetNode} />

      {!!modal &&
        <ImageDetailModal
          post={postsById[modal.postId]}
          image={modal}
          onSelectPortfolioItem={openModal}
          onClose={closeModal}
        />
      }
    </>
  )
}
