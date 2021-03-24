import styled, { keyframes } from 'styled-components'

const bouncein = keyframes`
  from { transform: scale(0.25); }
  to   { transform: scale(1);    }
`

export const ImageDetailModalContainer = styled.div`
  position: relative;
  width: 70% !important;

  background-color: #fff;
  padding: 1rem;

  animation: ${bouncein} .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`

export const Hero = styled.img`
  max-height: 50%;
`

export const HeroCaption = styled.div`
  font-style: italic;
`

export const PostCaption = styled.div`

`

export const PostImages = styled.div`
  width: 90%;
  display: flex;
  flex-wrap: wrap;
`

export const PostImage = styled.img`
  width: 25%;
`

