// Simple test to add more points to an existing voronoi diagram
import { useState, useCallback, useRef, useEffect } from 'react'

import { useObserver } from '../hooks/useObserver'

import ImageDetailModal from './ImageDetailModal'
import Visualization from './Visualization'

import imageManifest, { postsById, imagesByFileId } from '../util/loadManifest'
import { setHash } from '../util/hash'

export default function Portfolio ({ landingImage = false }) {
  // Infinite scroll
  const observerTargetNode = useRef()
  const [page, setPage] = useState(0)
  const nextPage = useCallback(() => setPage(prevPage => prevPage + 1), [])
  useObserver(observerTargetNode, nextPage)

  // Modal
  const [modal, setModal] = useState(landingImage || false)
  // Memoize `openModal` to prevent unnecessary <Visualization> rerenders
  const openModal = useCallback(portfolioImage => {
    const image = imagesByFileId[portfolioImage.fileId]
    setModal(image)
    setHash(image.fileId)
  }, [])

  const closeModal = () => {
    setModal(false)
    setHash()
  }

  // Prevent body from scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : 'unset'
  }, [modal])

  return (
    <>
      <Visualization
        page={page}
        imageManifest={imageManifest}
        onSelectImage={openModal}
      />

      <div id="ObserverTarget" ref={observerTargetNode} />

      {!!modal &&
        <ImageDetailModal
          post={postsById[modal.postId]}
          image={modal}
          onSelectImage={openModal}
          onClose={closeModal}
        />
      }
    </>
  )
}
