import Modal from '../Modal'

import {
  ImageDetailModalContainer,
  Hero,
  HeroCaption,
  PostCaption,
  PostImages,
  PostImage
} from './styles'

import { IMAGES_DIRECTORY } from '../../config'

// Creates an object that is passed to `dangerouslySetInnerHTML`. There's no
// user input involved here, so this is safe.
const createCaption = __html => ({ __html });

export default function ImageDetailModal ({ post, image, onClose }) {
  return (
    <Modal>
      <ImageDetailModalContainer>
        <div onClick={onClose}>close</div>

        <Hero src={`${IMAGES_DIRECTORY}/${image.filename}`} alt={image.caption} />

        <HeroCaption>{image.caption}</HeroCaption>

        {post.photos.length > 1 &&
          <PostImages>
            {post.photos.map(photo =>
              <PostImage
                src={`${IMAGES_DIRECTORY}/${photo.meta.filename}`}
                isCurrentlySelected={photo.meta.fileId === image.fileId}
                alt={photo.meta.caption}
                key={photo.meta.postIndex}
              />
            )}
          </PostImages>
        }

        <PostCaption dangerouslySetInnerHTML={createCaption(post.caption)} />

      </ImageDetailModalContainer>
    </Modal>
  )
}

