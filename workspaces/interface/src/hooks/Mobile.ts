import { useEffect, useState } from 'react'

// Copied from react-use, so if we ever decide to include that library,
// replace this implementation with the react-use version.
function useMedia(query: string, defaultState = false) {
  const [state, setState] = useState(() =>
    typeof window === 'undefined'
      ? defaultState
      : window.matchMedia(query).matches,
  )

  useEffect(() => {
    let mounted = true
    const queryList = window.matchMedia(query)
    const onChange = () => {
      if (!mounted) {
        return
      }
      setState(queryList.matches)
    }

    queryList.addEventListener('change', onChange)
    setState(queryList.matches)

    return () => {
      mounted = false
      queryList.removeEventListener('change', onChange)
    }
  }, [query])

  return state
}

export default function useMobile() {
  return useMedia('(max-width: 767px)')
}
