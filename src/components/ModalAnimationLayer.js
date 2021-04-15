import { useRef, useEffect } from 'react'
import { line } from 'd3-shape'

import walkCells from '../util/walkCells'

const path = line()

export default function ModalAnimationLayer ({
  polygons,
  voronoi,
  visibleCells,
  selectedImageIndex
}) {
  // Create "layers" comprised of immediate cell neighbors (recursive)
  const layers = walkCells(selectedImageIndex, voronoi, visibleCells)
    .map(layer => layer.map(cellIndex => polygons[cellIndex]))

  if (!layers?.length) return null;

  return (
    <svg id="modal-animation-overlay" style={{pointerEvents: 'none'}}>
      {layers.map((layer, i) =>
        <g className="layer" key={i}>
          {layer.map(cell =>
            <AnimatedPath
              layerIndex={i}
              d={path(cell)}
              fill="#fff"
              strokeWidth="2"
              stroke="#fff"
              key={cell.index}
            />
          )}
        </g>
      )}
    </svg>
  )
}

function AnimatedPath ({ layerIndex, ...pathProps }) {
  const path = useRef()

  useEffect(() => {
    path.current.animate({ fillOpacity: 1 }, {
      delay: 105 * layerIndex,
      duration: 1000,
      fill: 'forwards'
    })
  }, [layerIndex])

  return (
    <path ref={path} {...pathProps} fillOpacity="0" />
  )
}
