// FIXME Should prob do this in the preprocessing step that produces the scraped manifest.json
import { shuffle } from './index'

import manifest from '../manifest.json'

  // We'll use this to skip everything before Dec 2011 (my really raw, old work)
  const dateFloor = new Date(2011, 11, 1)

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

  // Skip super early work
  const date = new Date(post.date)
  if (date < dateFloor) continue;

  for (let i = 0; i < post.photos.length; i++) {
    const {
      caption,
      original_size: {
        width,
        height,
        url
      }
    } = post.photos[i]

    const imageMeta = {
      width,
      height,
      caption,
      filename: url.split('/').splice(-1)[0],
      postId: post.id_string,
      photoIndex: i,
      fileId: fileCount++
    }

    imageManifest.push(imageMeta)
    // Add the photo metadata to the post so we can access other post images
    // easily in a modal
    postsById[post.id_string].photos[i].meta = imageMeta
  }
}

export default shuffle(imageManifest)

export const imagesByFileId = imageManifest.reduce((images, image) => ({
  ...images,
  [image.fileId]: image
}), {})
