export default function timer (callback, duration, delay = 0, autoStart = true) {
  let active = false
  let elapsed = null

  function start () {
    if (active) return; // Cannot start more than once

    active = true

    // Account for elapsed time (if coming from a paused state)
    const now = performance.now()
    const startTime = elapsed ? (now - elapsed) : now

    requestAnimationFrame(function tick (now) {
      if (!active) return;

      // Account for delay
      if (!elapsed && delay && (now - startTime < delay)) {
        return requestAnimationFrame(tick)
      }

      elapsed = now - startTime

      if (elapsed < duration) {
        callback(elapsed / duration, elapsed)
        requestAnimationFrame(tick)
      } else {
        callback(1, duration)
        reset()
      }
    })
  }

  function pause () {
    active = false
  }

  function reset () {
    active = false
    elapsed = null
  }

  if (autoStart) {
    start()
  }
  return { start, pause, reset }
}
