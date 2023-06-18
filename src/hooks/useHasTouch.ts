import { useEffect, useState } from 'react'

export function useHasTouch() {
  const [hasTouch, setHasTouch] = useState(false)

  useEffect(() => {
    setHasTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return hasTouch
}
