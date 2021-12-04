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

// export async function getServerSideProps() {
//   // Fetch data from external API
//   const res = await fetch(`https://.../data`)
//   const data = await res.json()

//   querySubgraph(
//     {
//       entity: 'project',
//       keys: ['createdAt', 'totalPaid'],
//       where: {
//         key: 'id',
//         value: projectId.toString(),
//       },
//     },
//     res => {
//       if (!res?.projects) return
//       const project = parseProjectJson(res.projects[0])
//       setCreatedAt(project.createdAt)
//       setEarned(project.totalPaid)
//     },
//   )

//   return { props: { data } }
// }

export default ProjectPage
