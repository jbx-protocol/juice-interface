import { useState, useEffect } from 'react'

import Dashboard from 'components/Dashboard'

function ProjectPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <Dashboard />
}

export async function getServerSideProps() {}

export default ProjectPage
