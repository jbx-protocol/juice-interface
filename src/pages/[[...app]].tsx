import { useState, useEffect } from 'react'

import Router from '../components/Router'

function CatchallPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <Router />
}

export default CatchallPage
