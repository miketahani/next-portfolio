// Return a shuffled copy of a given array
export function shuffle (arr) {
  if (!arr?.length) return arr;
  const _arr = [...arr], next = []
  while (next.length < arr.length) {
    next.push(_arr.splice(Math.floor(Math.random() * _arr.length), 1)[0])
  }
  return next
}

export function extent (arr, accessor) {
  const firstItem = accessor(arr[0])

  return arr.slice(1).reduce(([min, max], _item) => {
    const item = accessor(_item)
    if (item < min) min = item;
    if (item > max) max = item;
    return [min, max]
  }, [firstItem, firstItem])
}

export function getBBox (vertices) {
  const x = extent(vertices, d => d[0])
  const y = extent(vertices, d => d[1])
  return {
    x: x[0],
    y: y[0],
    width: x[1] - x[0],
    height: y[1] - y[0]
  }
}

export function fitImage (image, bbox) {
  const scale = Math.max(bbox.width / image.width, bbox.height / image.height) * 2
  return {
    width: image.width * scale,
    height: image.height * scale
  }
}

export function asyncFetchImage (imagePath) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', reject)
    image.src = imagePath
  })
}

export function debounce (fn, duration) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      fn.apply(this, args)
    }, duration)
  }
}

// @param {float} value  Number between 0 and 1
export function lerp (min, max, value) {
  return (max - min) * value + min
}
