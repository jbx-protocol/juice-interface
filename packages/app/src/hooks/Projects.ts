import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ContractName } from 'constants/contract-name'
import { ProjectIdentifier } from 'models/projectIdentifier'
import { useCallback, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { deepEqProjectIdentifiers } from 'utils/deepEqProjectIdentifiers'

import useContractReader from './ContractReader'

export function useProjects(
  owner: string | undefined,
  readProvider: JsonRpcProvider | undefined,
) {
  const [index, setIndex] = useState<BigNumber>()
  const [projectIds, setProjectIds] = useState<BigNumber[]>([])
  const [projects, setProjects] = useState<Record<string, ProjectIdentifier>>()

  function reset() {
    setIndex(BigNumber.from(0))
    setProjectIds([])
    setProjects({})
  }

  const balance = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'balanceOf',
    args: owner ? [owner] : null,
    provider: readProvider,
    valueDidChange: bigNumbersDiff,
    callback: useCallback(
      balance => {
        if (balance !== undefined) reset()
      },
      [reset],
    ),
  })

  useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'tokenOfOwnerByIndex',
    args: index && owner ? [owner, index?.toHexString()] : undefined,
    provider: readProvider,
    valueDidChange: bigNumbersDiff,
    callback: useCallback(
      projectId => {
        if (
          projectId &&
          !projectIds.map(t => t.toString()).includes(projectId.toString())
        ) {
          setProjectIds([...projectIds, projectId])
          if (index?.add(1).lt(balance ?? 0)) setIndex(index?.add(1))
        }
      },
      [setProjectIds, projectIds, index],
    ),
  })

  const id = index ? projectIds[index.toNumber()] : undefined

  useContractReader<ProjectIdentifier>({
    contract: ContractName.Projects,
    functionName: 'getIdentifier',
    args: id ? [id.toHexString()] : null,
    valueDidChange: useCallback(
      (oldVal, newVal) => !deepEqProjectIdentifiers(oldVal, newVal),
      [],
    ),
    callback: useCallback(
      (project?: ProjectIdentifier) => {
        if (!project || !id) return

        setProjects({
          ...projects,
          [id?.toString()]: project,
        })
      },
      [projects, setProjects, id],
    ),
  })

  return projects
}
