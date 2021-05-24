import { BigNumber } from '@ethersproject/bignumber'
import { ContractName } from 'models/contract-name'
import { ProjectIdentifier } from 'models/project-identifier'
import { useCallback, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { deepEqProjectIdentifiers } from 'utils/deepEqProjectIdentifiers'

import useContractReader from './ContractReader'

export function useProjects() {
  const [loadingIndex, setLoadingIndex] = useState<BigNumber>()
  const [projectIds, setProjectIds] = useState<BigNumber[]>([])
  const [projects, setProjects] = useState<Record<string, ProjectIdentifier>>()

  function upsertProject(project: ProjectIdentifier) {
    setProjects({
      ...projects,
      [project.handle]: project,
    })
  }

  function upsertProjectId(id: BigNumber) {
    setProjectIds([...projectIds, id])
  }

  function reset() {
    setLoadingIndex(BigNumber.from(0))
    setProjectIds([])
    setProjects(undefined)
  }

  const supply = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'totalSupply',
    valueDidChange: bigNumbersDiff,
    callback: reset,
  })

  useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'tokenByIndex',
    args: loadingIndex ? [loadingIndex.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    callback: useCallback(
      projectId => {
        if (
          projectId &&
          !projectIds.map(t => t.toString()).includes(projectId.toString())
        ) {
          upsertProjectId(projectId)
          if (loadingIndex?.add(1).lt(supply ?? 0))
            setLoadingIndex(loadingIndex?.add(1))
        }
      },
      [projectIds, loadingIndex],
    ),
  })

  const id = loadingIndex ? projectIds[loadingIndex.toNumber()] : undefined

  useContractReader<ProjectIdentifier>({
    contract: ContractName.Projects,
    functionName: 'getInfo',
    args: id ? [id.toHexString()] : null,
    valueDidChange: useCallback(
      (oldVal, newVal) => !deepEqProjectIdentifiers(oldVal, newVal),
      [],
    ),
    callback: useCallback(
      (project?: ProjectIdentifier) => {
        if (!project) return
        upsertProject(project)
      },
      [id],
    ),
  })

  return projects
}
