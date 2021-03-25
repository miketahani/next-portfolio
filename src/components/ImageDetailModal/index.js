import { timeFormat } from 'd3-time-format'

import Modal from '../Modal'

import {
  ImageDetailModalContainer,
  Header,
  Title,
  Hero,
  HeroCaption,
  PostCaption,
  PostImages,
  PostImageContainer,
  PostImage,
  Footer,
  PostDate,
  NoteCount,
  Tag
} from './styles'

import { IMAGES_DIRECTORY } from '../../config'

const formatTime = timestamp => timeFormat('%d %b %Y')(timestamp * 1000);

// Creates an object that is passed to `dangerouslySetInnerHTML`. There's no
// user input involved here, so this is safe.
const createCaption = __html => ({ __html });

export default function ImageDetailModal ({ post, image, onClose }) {
  return (
    <Modal>
      <ImageDetailModalContainer>
        <Header>
          <PostDate>{formatTime(post.timestamp)}</PostDate>
          <NoteCount>❤︎ {post.note_count}</NoteCount>
          <div onClick={onClose}>close</div>
        </Header>

        <Hero src={`${IMAGES_DIRECTORY}/${image.filename}`} alt={image.caption || post.summary} />

        <HeroCaption>{image.caption}</HeroCaption>

        {post.photos.length > 1 &&
          <PostImages>
            {post.photos.map(photo =>
              // Container is display: flex, so surround the <img> with a
              // display: block element so image scales correctly
              <PostImageContainer key={photo.meta.photoIndex}>
                <PostImage
                  src={`${IMAGES_DIRECTORY}/${photo.meta.filename}`}
                  isCurrentlySelected={photo.meta.fileId === image.fileId}
                  alt={photo.meta.caption || `(image ${photo.meta.photoIndex + 1}/${post.photos.length})`}
                />
              </PostImageContainer>
            )}
          </PostImages>
        }

        <PostCaption dangerouslySetInnerHTML={createCaption(post.caption)} />

        <Footer>
          {post.tags.length > 0 &&
            <>
              <span>Tags</span>
              {post.tags.map(tag =>
                <Tag key={tag}>{tag}</Tag>
              )}
            </>
          }
        </Footer>
      </ImageDetailModalContainer>
    </Modal>
  )
}
