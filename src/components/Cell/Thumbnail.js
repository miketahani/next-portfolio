import { getBBox, fitImage } from '../../util'

export default function Thumbnail ({ image, localPath, polygon, position, index }) {
  if (!polygon) return null;

  const bbox = getBBox(polygon)
  const { width, height } = fitImage(image, bbox)

  return (
    <image
      href={localPath}
      width={~~width}
      height={~~height}
      clipPath={`url(#poly-${index})`}
      x={position[0] - width / 2}
      y={position[1] - height / 2}
    />
  )
}
