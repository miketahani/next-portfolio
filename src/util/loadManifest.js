// FIXME Should prob do this in the preprocessing step that produces the scraped manifest.json
import { shuffle } from './index'

import manifest from '../manifest.json'

// Use this to get width and height instead of loading images twice (once as an
// HTMLImageElement via `new Image(...)` to get the dimensions, then again via
// an SVG `<image href=...>`)
export const postsById = manifest.posts.reduce((posts, post) => ({
  ...posts,
  [post.id_string]: post
}), {})

let fileCount = 0
const imageManifest = []
for (let post of manifest.posts) {
  for (let photo of post.photos) {
    const { width, height, url } = photo.original_size

    imageManifest.push({
      fileId: fileCount++,
      postId: post.id_string,
      filename: url.split('/').splice(-1)[0],
      width: width,
      height: height
    })
  }
}

export default shuffle(imageManifest)
