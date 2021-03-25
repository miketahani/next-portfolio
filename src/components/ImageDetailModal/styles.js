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

export const Header = styled.header`
  display: flex;
  font-weight: bold;
  font-size: 1.2rem;
  text-transform: uppercase;
`

export const Title = styled.div`
`

export const Hero = styled.img`
  max-width: 100%;
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
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
`

export const PostImageContainer = styled.div`
  width: 25%;
`

export const PostImage = styled.img`
  width: 100%;
`

export const Tag = styled.div`
  background-color: #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
  padding: 0.5rem;
  margin: 0.25rem;
`

export const Footer = styled.footer`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

export const PostDate = styled.div`

`

export const NoteCount = styled.div`

`
