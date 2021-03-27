import { useState, useEffect, useMemo } from 'react'
import { Delaunay } from 'd3-delaunay'

import { useDebouncedResize } from './useDebouncedResize'
import { lerp } from '../util'
import { IMAGES_PER_PAGE, IMAGES_DIRECTORY } from '../config'

export default function useResponsiveVoronoi (page, imageManifest) {
  const [points, setPoints] = useState([])

  const [width, height] = useDebouncedResize(250)

  // Load new images when page updates
  useEffect(() => {
    (async () => {
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
    })()
  }, [page, imageManifest])

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

  /**
   * Need to create this intermediary value because `page` updates before
   * the new voronoi is calculated, which means using `page + 1` in the SVG
   * height and viewBox will cause "stretching" in the diagram before the new
   * cells are added to the visualization.
   */
  const visPage = voronoi.length / IMAGES_PER_PAGE

  return {
    width,
    height,
    points,
    voronoi,
    visPage
  }
}
