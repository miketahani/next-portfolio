// Some utils for getting and setting the URL hash, for when we want to link to
// a specific image.
import imageManifest from './loadManifest'

const stripHash = hash => hash.startsWith('#') ? hash.slice(1) : hash;

// If there's a URL hash with a valid image ID on load, open the modal with that
// image. This happens ONCE when the page loads for the first time.
export function getLandingImage (hash = window.location.hash) {
  hash = stripHash(hash)

  if (!hash) return null;

  const id = new URLSearchParams(hash).get('id')

  return id !== null
    ? imageManifest.find(image => image.fileId === +id)
    : null
}

// Set a new hash with the currently-selected image ID; for linking to an image
export function setHash (id) {
  let hash = ''
  if (typeof id === 'number') {
    hash = new URLSearchParams(stripHash(window.location.hash))
    hash.set('id', id)
  }
  window.location.hash = hash.toString()
}
