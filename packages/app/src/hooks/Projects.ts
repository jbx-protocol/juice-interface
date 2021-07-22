import axios, { AxiosResponse } from 'axios'
import { subgraphUrl } from 'constants/subgraphs'
import { utils } from 'ethers'
import { ProjectInfo } from 'models/project-info'
import { useEffect, useState } from 'react'
import { formatGraphQuery } from 'utils/graph'

export function useProjects({
  pageNumber,
  id,
  handle,
  owner,
  uri,
}: {
  pageNumber?: number
  id?: string
  handle?: string
  owner?: string
  uri?: string
}) {
  const [projects, setProjects] = useState<ProjectInfo[]>()

  const pageSize = 50

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
        subgraphUrl,
        {
          query: formatGraphQuery({
            entity: 'project',
            keys: ['handle', 'owner', 'createdAt', 'uri'],
            first: pageSize,
            skip: pageNumber ? pageNumber * pageSize : undefined,
            orderDirection: 'asc',
            orderBy: 'createdAt',
            where: owner
              ? {
                  key: 'owner',
                  operator: 'contains',
                  value: owner,
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res: AxiosResponse<{ data: { projects: ProjectInfo[] } }>) =>
        setProjects(res.data?.data?.projects?.map(p => formatProject(p)) ?? []),
      )
      .catch(err => console.log('Error getting projects', err))
  }, [pageNumber, id, handle, owner, uri])

  return projects
}
