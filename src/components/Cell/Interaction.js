import { getBBox } from '../../util'
import { line } from 'd3-shape'

const path = line()

// Path for a cell and its associated intersection observer "trigger" (for tracking
//  elements in viewport)
export default function Interaction ({ cell, onSelectCell }) {
  const bbox = getBBox(cell)

  return (
    <g className="Interaction">
      {/**
        * Use a foreignObject with an HTML trigger because
        * IntersectionObserver doesn't work work with SVG.
        */}
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
        onClick={onSelectCell}
      />
    </g>
  )
}
