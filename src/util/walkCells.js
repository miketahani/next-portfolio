/**
* Recursively find neighboring cells, collecting each cell and its immediate
* neighbors into "layers" while avoiding duplicate indices.
*/
export default function walkCells (index, voronoi, activeCells, _layers = [], _done = []) {
 const neighbors = [...voronoi.neighbors(index)]
   .filter(neighbor => activeCells.includes(neighbor) && !_done.includes(neighbor))

 _done.push(...neighbors, index)

 if (neighbors.length) _layers.push(neighbors)

 for (let neighbor of neighbors) {
   walkCells(neighbor, voronoi, activeCells, _layers, _done)
 }

 return _layers
}
