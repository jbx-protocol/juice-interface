import axios, { AxiosResponse } from 'axios'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'

import { ProjectInfo } from '../models/project-info'

export function useProjects({
  count,
  id,
  handle,
  owner,
  createdAt,
  uri,
}: {
  count?: number
  id?: string
  handle?: string
  owner?: string
  createdAt?: number
  uri?: string
}) {
  const [projects, setProjects] = useState<ProjectInfo[]>([])

  const query = `{
    projects(first: 20) {
      id
      handle
      owner
      createdAt
      uri
    }
  }`

  console.log('useprojects')

  const formatProject = (project: {
    id: string
    handle: string
    owner: string
    createdAt: number
    uri: string
  }) => ({
    ...project,
    handle: utils.parseBytes32String(project.handle),
  })

  useEffect(() => {
    axios
      .post(
        'http://localhost:8000/subgraphs/name/juice-local',
        JSON.stringify({ query }),
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res: AxiosResponse<{ data: { projects: ProjectInfo[] } }>) => {
        console.log('useprojects2', res.data.data.projects)
        setProjects(res.data.data.projects.map(p => formatProject(p)))
      })
      .catch(err => console.log('Error getting projects', err))
  }, [count, id, handle, owner, createdAt, uri])

  return projects
}

// export function useProjects() {
//   const [loadingIndex, setLoadingIndex] = useState<BigNumber>()
//   const [projectIds, setProjectIds] = useState<BigNumber[]>([])
//   const [projects, setProjects] = useState<Record<string, ProjectIdentifier>>()

//   function upsertProject(project: ProjectIdentifier) {
//     setProjects({
//       ...projects,
//       [project.handle]: project,
//     })
//   }

//   function upsertProjectId(id: BigNumber) {
//     setProjectIds([...projectIds, id])
//   }

//   function reset() {
//     setLoadingIndex(BigNumber.from(0))
//     setProjectIds([])
//     setProjects(undefined)
//   }

//   const supply = useContractReader<BigNumber>({
//     contract: ContractName.Projects,
//     functionName: 'totalSupply',
//     valueDidChange: bigNumbersDiff,
//     callback: reset,
//   })

//   useContractReader<BigNumber>({
//     contract: ContractName.Projects,
//     functionName: 'tokenByIndex',
//     args: loadingIndex ? [loadingIndex.toHexString()] : null,
//     valueDidChange: bigNumbersDiff,
//     callback: useCallback(
//       projectId => {
//         if (
//           projectId &&
//           !projectIds.map(t => t.toString()).includes(projectId.toString())
//         ) {
//           upsertProjectId(projectId)
//           if (loadingIndex?.add(1).lt(supply ?? 0))
//             setLoadingIndex(loadingIndex?.add(1))
//         }
//       },
//       [projectIds, loadingIndex],
//     ),
//   })

//   const id = loadingIndex ? projectIds[loadingIndex.toNumber()] : undefined

//   useContractReader<ProjectIdentifier>({
//     contract: ContractName.Projects,
//     functionName: 'getInfo',
//     args: id ? [id.toHexString()] : null,
//     valueDidChange: useCallback(
//       (oldVal, newVal) => !deepEqProjectIdentifiers(oldVal, newVal),
//       [],
//     ),
//     callback: useCallback(
//       (project?: ProjectIdentifier) => {
//         if (!project) return
//         upsertProject(project)
//       },
//       [id],
//     ),
//   })

//   return projects
// }
