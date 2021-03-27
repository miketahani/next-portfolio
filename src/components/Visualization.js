import { line } from 'd3-shape'

import CellImage from './CellImage'

import useResponsiveVoronoi from '../hooks/useResponsiveVoronoi'

const path = line()

export default function Visualization ({ page, imageManifest, onSelectImage }) {
  const {
    width,
    height,
    points,
    voronoi,
    visPage
  } = useResponsiveVoronoi(page, imageManifest)

  if (!voronoi.length) return 'Loading'

  return (
    <svg
      width="100vw"
      height={`${visPage * 100}vh`}
      viewBox={`0 0 ${width} ${visPage * height}`}
      style={{marginBottom: '100px'}}
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
        {points.map(({ meta, page: _page, filePath, x, y }, i) =>
          <CellImage
            image={meta}
            localPath={filePath}
            polygon={voronoi[i]}
            // FIXME oh god the jank
            position={[x * width, y * height + _page * height]}
            index={i}
            key={meta.fileId}
          />
        )}
      </g>

      <g id="outlines">
        {voronoi.map(cell =>
          <path
            d={path(cell)}
            strokeWidth="2"
            stroke="#fff"
            fillOpacity="0"
            onClick={() => onSelectImage(points[cell.index].meta)}
            key={cell.index}
          />
        )}
      </g>
    </svg>
  )
}
