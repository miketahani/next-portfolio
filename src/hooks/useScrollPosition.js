import { useEffect, useState } from 'react'
import { debounce } from '../util'

// Track scroll position, returning position and optionally executing a callback on update
export default function useScrollPosition (debounceTimeout = false, callback) {
  const [scroll, setScroll] = useState(window.scrollY)

  useEffect(() => {
    let handleScroll = () => {
      setScroll(window.scrollY) // Set internal scroll position
      if (callback) callback(window.scrollY) // Callback with scroll position
    }
    // Debounce the scroll handler if we have a debounce timeout
    if (debounceTimeout) handleScroll = debounce(handleScroll, debounceTimeout)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [callback, debounceTimeout])

  return scroll
}
