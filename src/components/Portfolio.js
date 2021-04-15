// Simple test to add more points to an existing voronoi diagram
import { useState, useCallback, useRef, useEffect } from 'react'

import { useObserver } from '../hooks/useObserver'

import ImageDetailModal from './ImageDetailModal'
import Visualization from './Visualization'

import imageManifest, { postsById, imagesByFileId } from '../util/loadManifest'
import { setHash } from '../util/hash'
import { IMAGES_PER_PAGE } from '../config'

const MAX_PAGES = Math.ceil(imageManifest.length / IMAGES_PER_PAGE)

export default function Portfolio ({ landingImage = false }) {
  // Infinite scroll
  const observerTargetNode = useRef()
  const [page, setPage] = useState(0)
  const nextPage = useCallback(() => setPage(prevPage =>
    // Only increment when we have more images to display
    (prevPage + 1) < MAX_PAGES ? (prevPage + 1) : prevPage
  ), [])
  useObserver(observerTargetNode, nextPage)

  const [selectedCell, setSelectedCell] = useState()

  // Modal
  const [modal, setModal] = useState(landingImage || false)
  // Memoize `openModal` to prevent unnecessary <Visualization> rerenders
  const openModal = useCallback((portfolioImage, cellIndex) => {
    const image = imagesByFileId[portfolioImage.fileId]
    // setModal(image)
    setSelectedCell(cellIndex)
    // setHash(image.fileId)
  }, [])

  const closeModal = () => {
    // setModal(false)
    // setHash()
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
        selectedImageIndex={selectedCell}
        onSelectImage={openModal}
      />

      {(page + 1) < MAX_PAGES &&
        <button id="ObserverTarget" ref={observerTargetNode} onClick={nextPage}>
          Load more
        </button>
      }

      {/*!!modal &&
        <ImageDetailModal
          post={postsById[modal.postId]}
          image={modal}
          onSelectImage={openModal}
          onClose={closeModal}
        />
      */}
    </>
  )
}
