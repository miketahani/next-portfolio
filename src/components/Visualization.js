import { useEffect, useState, useRef, useMemo } from 'react'

import { Delaunay } from 'd3-delaunay'

import { line } from 'd3-shape'

import CellImage from './CellImage'
// import ModalAnimationLayer from './ModalAnimationLayer'

// import useElementsTracker from '../hooks/useViewportElementsTrackerNaive'
import useElementsTracker from '../hooks/useViewportElementsTracker'

import { getBBox } from '../util'
import { useDebouncedResize } from '../hooks/useDebouncedResize'
import { lerp } from '../util'
import { IMAGES_PER_PAGE, IMAGES_DIRECTORY } from '../config'


const path = line()

const getCellIndex = ({ target }) => +target.dataset.cell;

export default function Visualization ({ page, imageManifest, selectedImageIndex, onSelectImage }) {
  const [points, setPoints] = useState([])
  const [width, height] = useDebouncedResize(250)

  // Load new images when page updates
  useEffect(() => {
    const nextImages = imageManifest
      .slice(page * IMAGES_PER_PAGE, (page + 1) * IMAGES_PER_PAGE)

    // Add random normalized xy coords which will be combined with `page` when we calc voronoi
    const nextPoints = nextImages.map(meta => ({
      meta,
      page,
      filePath: `${IMAGES_DIRECTORY}/${meta.filename}`,
      x: lerp(0.05, 0.95, Math.random()),
      y: lerp(0.05, 0.95, Math.random())
    }))
    setPoints(prevPoints => [...prevPoints, ...nextPoints])
  }, [page, imageManifest])

  const voronoi = useMemo(() => {
    if (!points.length) return null

    const delaunayPoints = points.map(({ page: _page, x, y }) => [
      x * width,
      y * height + _page * height
    ])
    const delaunay = Delaunay.from(delaunayPoints)
    return delaunay.voronoi([0, 0, width, (page + 1) * height])
  }, [points, page, width, height])

  const polygons = useMemo(() => voronoi ? [...voronoi.cellPolygons()] : [], [voronoi])

  /**
   * Need to create this intermediary value because `page` updates before
   * the new voronoi is calculated, which means using `page + 1` in the SVG
   * height and viewBox will cause "stretching" in the diagram before the new
   * cells are added to the visualization.
   */
  const visPage = polygons.length / IMAGES_PER_PAGE

  // Naive
  // const rootRef = useRef()
  // const visibleCells = useElementsTracker(rootRef, '.trigger', getCellIndex)

  // Galaxy brain
  const [rootRef, visibleCells] = useElementsTracker('.trigger', getCellIndex)

  console.log('visibleCells', visibleCells)

  return (
    <svg
      width="100vw"
      height={`${visPage * 100}vh`}
      viewBox={`0 0 ${width} ${visPage * height}`}
      style={{marginBottom: '100px'}}
    >
      <defs>
        {polygons.map(cell =>
          <clipPath id={`poly-${cell.index}`} key={cell.index}>
            <path
              d={path(cell)}
              fill="none"
            />
          </clipPath>
        )}
      </defs>

      <g id="images">
        {points.map(({ meta, page: _page, filePath, x, y }, i) =>
          <CellImage
            image={meta}
            localPath={filePath}
            polygon={polygons[i]}
            position={[x * width, y * height + _page * height]}
            index={i}
            key={meta.fileId}
          />
        )}
      </g>

      {/* Debugging */}
      <g className="DEBUG">
        {points.map((point, i) =>
          visibleCells.includes(i)
            ? <circle
                cx={point.x * width}
                cy={point.y * height + point.page * height}
                r={10}
                fill="red"
                key={i}
              />
            : null
        )}
      </g>

      <g id="outlines">
        {/**
         * Adding the ref here is a hack to ensure that `polygons` has been
         * calculated and useViewportElementsTracker has access to the trigger
         * nodes for tracking elements in the viewport.
         */}
        {polygons.length > 0 &&
          <g ref={rootRef}>
            {polygons.map(cell => {
              const bbox = getBBox(cell)

              return (
                <g key={cell.index}>
                  <foreignObject {...bbox} style={{pointerEvents: 'none'}}>
                    <div
                      className="trigger"
                      data-cell={cell.index}
                      style={{
                        width: `${bbox.width}px`,
                        height: `${bbox.height}px`
                      }}
                    />
                  </foreignObject>

                  <path
                    d={path(cell)}
                    strokeWidth="2"
                    stroke="#fff"
                    fillOpacity="0"
                    onClick={() => console.log('click', cell.index) || onSelectImage(points[cell.index].meta, cell.index)}
                  />
                </g>
              )
            })}
          </g>
        }
      </g>

      {/*typeof selectedImageIndex === 'number' &&
        <ModalAnimationLayer
          polygons={polygons}
          voronoi={voronoi}
          visibleCells={visibleCells}
          selectedImageIndex={selectedImageIndex}
        />
      */}
    </svg>
  )
}
