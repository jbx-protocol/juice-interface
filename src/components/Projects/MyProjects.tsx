import { NetworkContext } from 'contexts/networkContext'
import { useMyProjectsQuery } from 'hooks/Projects'
import { useContext } from 'react'

export default function MyProjects() {
  const { userAddress } = useContext(NetworkContext)

  const { data: projects } = useMyProjectsQuery(userAddress)

  console.log('My projects:', projects)

  return <div></div>
}
