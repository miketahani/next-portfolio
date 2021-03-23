// Simple test to add more points to an existing voronoi diagram
import { useState, useEffect, useCallback, useRef } from 'react'
import { Delaunay } from 'd3-delaunay'
import { line } from 'd3-shape'

import { useObserver } from './hooks/useObserver'
import { useDebouncedResize } from './hooks/useDebouncedResize'
import { shuffle, asyncFetchImage } from './util'

import CellImage from './CellImage'

import manifest from './manifest.json'

// Just need to do this once
const imageManifest = shuffle(
  Object.entries(manifest.local)
    .map(([id, filenames]) => filenames.map((filename, i) => [id, filename, i]))
    .flat()
)

const IMAGES_DIRECTORY = `${process.env.PUBLIC_URL}/datahacker-images`
const IMAGES_PER_PAGE = 50

const path = line()

export default function Portfolio () {
  const [page, setPage] = useState(0)
  const [points, setPoints] = useState([])
  const [voronoi, setVoronoi] = useState([])
  const observerTargetNode = useRef()

  const [width, height] = useDebouncedResize(250)

  // FIXME Hack to update the target node value of `useObserver` because it's a ref
  const [isObserverTargetMounted, setIsMounted] = useState(false)
  useEffect(() => { if (observerTargetNode.current && !isObserverTargetMounted) setIsMounted(true) })

  const nextPage = useCallback(() => setPage(prevPage => prevPage + 1), [])
  useObserver(observerTargetNode.current, nextPage)

  const addPoints = useCallback(() => {
    (async () => {
      const nextImages = imageManifest
        .slice(page * IMAGES_PER_PAGE, (page + 1) * IMAGES_PER_PAGE)

      const nextPoints = await Promise.all(nextImages.map(async ([id, filename]) => {
        const filePath = `${IMAGES_DIRECTORY}/${filename}`
        const image = await asyncFetchImage(filePath)
        return [
          {
            id,
            filePath,
            width: image.width,
            height: image.height
          },
          page,
          Math.random(),
          Math.random()
        ]
      }))
      setPoints(prevPoints => [...prevPoints, ...nextPoints])
    })()
  }, [page])

  // `addPoints` changes when `page` changes
  useEffect(() => { addPoints() }, [addPoints])

  useEffect(() => {
    const delaunayPoints = points.map(([image, _page, ...point]) => [
      point[0] * width,
      point[1] * height + _page * height
    ])
    const delaunay = Delaunay.from(delaunayPoints)
    const polygons = delaunay.voronoi([0, 0, width, (page + 1) * height]).cellPolygons()
    setVoronoi([...polygons])
  }, [points, page, width, height])

  console.log('PAGE', page, voronoi.length / IMAGES_PER_PAGE)

  if (!voronoi.length) return 'Loading'

  /**
   * Need to create this intermediary value because `page` updates before
   * the new voronoi is calculated, which means using `page + 1` in the SVG
   * height and viewBox will cause "stretching" in the diagram before the new
   * cells are added to the visualization.
   */
  const visPage = voronoi.length / IMAGES_PER_PAGE

  return (
    <>
      <svg
        width="100vw"
        height={`${visPage * 100}vh`}
        viewBox={`0 0 ${width} ${visPage * height}`}
        style={{paddingBottom: '100px'}}
      >
        <defs>
          {points.map(([image], i) =>
            <clipPath id={`poly-${i}`} key={i}>
              <path
                d={voronoi[i] && path(voronoi[i])}
                fill="none"
              />
            </clipPath>
          )}
        </defs>

        <g id="images">
          {points.map(([image, _page, ...position], i) =>
            <CellImage
              image={image}
              polygon={voronoi[i]}
              // FIXME oh god the jank
              position={[position[0] * width, position[1] * height + _page * height]}
              index={i}
              key={i}
            />
          )}
        </g>

        <g id="outlines">
          {voronoi && voronoi.map(cell =>
            <path
              d={path(cell)}
              strokeWidth="2"
              stroke="#fff"
              fill="none"
              key={cell.index}
            />
          )}
        </g>
      </svg>

      <div id="ObserverTarget" ref={observerTargetNode} />
    </>
  )
}
