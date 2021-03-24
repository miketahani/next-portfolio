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
  if (!post.photos) continue;

  for (let i = 0; i < post.photos.length; i++) {
    const {
      caption,
      original_size: {
        width,
        height,
        url
      }
    } = post.photos[i]

    imageManifest.push({
      width,
      height,
      caption: caption,
      filename: url.split('/').splice(-1)[0],
      postId: post.id_string,
      photoIndex: i,
      fileId: fileCount++
    })
  }
}

export default shuffle(imageManifest)
