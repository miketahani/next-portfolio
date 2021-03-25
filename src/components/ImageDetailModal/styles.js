import styled, { keyframes } from 'styled-components'

const bouncein = keyframes`
  from { transform: scale(0.25); }
  to   { transform: scale(1);    }
`

export const ImageDetailModalContainer = styled.div`
  position: relative;
  width: 70% !important;
  pointer-events: all;
  overflow: scroll;
  background-color: #fff;
  padding: 1rem;

  animation: ${bouncein} .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-weight: bold;
  font-family: ApercuBoldPro;
`

export const PostInfo = styled.div`
  display: flex;
  align-items: baseline;
`

export const HeaderItem = styled.div`
  margin: 0 0.25rem;
`

export const Title = styled.div`
  font-size: 2rem;
  margin-right: 1rem;
`

export const Hero = styled.img`
  max-width: 100%;
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
  max-width: 100%;
  max-height: 25rem;
`

export const TagsTitle = styled.span`
  font-family: ApercuBoldPro;
  font-size: 0.9rem;
  text-transform: uppercase;
`

export const Tag = styled.div`
  color: #666;
  border-radius: 5px;
  font-size: 0.9rem;
  padding: 0.25rem;
  margin: 0.1rem;
`

export const Footer = styled.footer`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
`

export const PostDate = styled.div`
  text-transform: uppercase;
  margin-right: 1rem;
  font-size: 1.3rem;
`

export const NoteCount = styled.div`
  margin-left: 1rem;
  font-size: 1.25rem;
`
