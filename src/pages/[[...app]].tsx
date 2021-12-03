import { useState, useEffect } from 'react'

import App from '../components/App'

function CatchallPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <App />
}

export default CatchallPage
