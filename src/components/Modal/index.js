import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import './style.css'

const modalRoot = document.getElementById('modal-root')

function createModalElement () {
  const el = document.createElement('div')
  el.classList.add('Modal')
  return el
}

export default function Modal ({ children }) {
  const el = useRef(createModalElement())

  useEffect(() => {
    const node = el.current
    modalRoot.appendChild(node)
    return () => modalRoot.removeChild(node)
  }, [])

  if (!el.current) return null

  return ReactDOM.createPortal(
    children,
    el.current
  )
}
