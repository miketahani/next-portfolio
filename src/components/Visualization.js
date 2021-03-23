import { useState, useEffect, useMemo } from 'react'

import { Delaunay } from 'd3-delaunay'
import { line } from 'd3-shape'

import { useDebouncedResize } from '../hooks/useDebouncedResize'
import { shuffle, asyncFetchImage } from '../util'

import CellImage from './CellImage'

import manifest from '../manifest.json'

// Just need to do this once
const imageManifest = shuffle(
  Object.entries(manifest.local)
    .map(([id, filenames]) => filenames.map((filename, i) => [id, filename, i]))
    .flat()
)

const IMAGES_DIRECTORY = `${process.env.PUBLIC_URL}/datahacker-images`
const IMAGES_PER_PAGE = 50

const path = line()

async function* loadImages (images) {
  for (let [id, filename] of images) {
    const filePath = `${IMAGES_DIRECTORY}/${filename}`
    const image = await asyncFetchImage(filePath)
    yield { id, filePath, width: image.width, height: image.height }
  }
}

export default function Visualization ({ page }) {
  const [points, setPoints] = useState([])

  const [width, height] = useDebouncedResize(250)

  // Load new images when page updates
  useEffect(() => {
    (async () => {
      const nextImages = imageManifest
        .slice(page * IMAGES_PER_PAGE, (page + 1) * IMAGES_PER_PAGE)

      const nextPoints = []
      // Load images explicitly (instead of via SVG <image href=...>) so we can
      // get their dimensions for free (for fitting images to clip path polygons)
      for await (let meta of loadImages(nextImages)) {
        // Add random normalized xy coords which will be calculated when we calc voronoi
        // FIXME poisson distribution?
        nextPoints.push({ meta, page, x: Math.random(), y: Math.random() })
      }
      setPoints(prevPoints => [...prevPoints, ...nextPoints])
    })()
  }, [page])

  const voronoi = useMemo(() => {
    if (!points.length) return []

    const delaunayPoints = points.map(({ page: _page, x, y }) => [
      x * width,
      y * height + _page * height
    ])
    const delaunay = Delaunay.from(delaunayPoints)
    const polygons = delaunay.voronoi([0, 0, width, (page + 1) * height]).cellPolygons()
    return [...polygons]
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
    <svg
      width="100vw"
      height={`${visPage * 100}vh`}
      viewBox={`0 0 ${width} ${visPage * height}`}
      style={{paddingBottom: '100px'}}
    >
      <defs>
        {voronoi.map(cell =>
          <clipPath id={`poly-${cell.index}`} key={cell.index}>
            <path
              d={path(cell)}
              fill="none"
            />
          </clipPath>
        )}
      </defs>

      <g id="images">
        {points.map(({ meta, page: _page, x, y }, i) =>
          <CellImage
            image={meta}
            polygon={voronoi[i]}
            // FIXME oh god the jank
            position={[x * width, y * height + _page * height]}
            index={i}
            key={i}
          />
        )}
      </g>

      <g id="outlines">
        {voronoi.map(cell =>
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
  )
}
