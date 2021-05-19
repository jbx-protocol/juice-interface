import { BigNumber } from '@ethersproject/bignumber'
import { ContractName } from 'models/contract-name'
import { ProjectIdentifier } from 'models/project-identifier'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { deepEqProjectIdentifiers } from 'utils/deepEqProjectIdentifiers'

import useContractReader from './ContractReader'

/** Get projects for owner. Pass `false` to get all projects. */
export function useProjects(owner: string | undefined | false) {
  const [noOwner, setNoOwner] = useState<boolean>()
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

  useEffect(() => {
    reset()
    setNoOwner(owner === false)
  }, [owner, setNoOwner])

  const supply = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: noOwner ? 'totalSupply' : 'balanceOf',
    args: useMemo(() => (noOwner ? undefined : owner ? [owner] : null), [
      noOwner,
      owner,
    ]),
    valueDidChange: bigNumbersDiff,
    callback: useCallback(_supply => {
      if (_supply !== undefined) reset()
    }, []),
  })

  useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: noOwner ? 'tokenByIndex' : 'tokenOfOwnerByIndex',
    args: useMemo(() => {
      if (noOwner) return loadingIndex ? [loadingIndex?.toHexString()] : null

      return loadingIndex && owner ? [owner, loadingIndex?.toHexString()] : null
    }, [owner, noOwner, loadingIndex]),
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
      [setProjectIds, projectIds, loadingIndex],
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
        if (!project || !id) return

        upsertProject(project)
      },
      [projects, setProjects, id],
    ),
  })

  return projects
}
