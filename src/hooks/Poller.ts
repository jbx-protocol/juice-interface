import { useEffect, useRef } from 'react'

export function usePoller(
  fn: VoidFunction,
  extraWatch?: unknown[],
  delay = 2000,
) {
  let savedCallback = useRef<VoidFunction>()

  // run at start too
  useEffect(
    function () {
      fn()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    extraWatch ?? [],
  )

  // Remember the latest fn.
  useEffect(
    function () {
      savedCallback.current = fn
    },
    [fn],
  )

  // Set up the interval.
  useEffect(
    function () {
      function tick() {
        if (savedCallback.current) savedCallback.current()
      }

      var id_1 = setInterval(tick, delay)
      return function () {
        return clearInterval(id_1)
      }
    },
    [delay],
  )
}
