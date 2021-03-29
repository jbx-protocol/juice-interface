import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ContractName } from 'constants/contract-name'
import { ProjectIdentifier } from 'models/projectIdentifier'
import { useEffect } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { deepEqProjectIdentifiers } from 'utils/deepEqProjectIdentifiers'

import useContractReader from './ContractReader'

export function useProjects(
  owner: string | undefined | null,
  readProvider: JsonRpcProvider | undefined,
) {
  const [noOwner, setNoOwner] = useState<boolean>()
  const [index, setIndex] = useState<BigNumber>()
  const [projectIds, setProjectIds] = useState<BigNumber[]>([])
  const [projects, setProjects] = useState<Record<string, ProjectIdentifier>>(
    {},
  )

  function reset() {
    setIndex(BigNumber.from(0))
    setProjectIds([])
    setProjects({})
  }

  useEffect(() => {
    reset()
    setNoOwner(owner === null)
  }, [owner, setNoOwner])

  const supply = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: noOwner ? 'totalSupply' : 'balanceOf',
    args: useMemo(() => (noOwner ? undefined : owner ? [owner] : null), [
      noOwner,
      owner,
    ]),
    provider: readProvider,
    valueDidChange: bigNumbersDiff,
    callback: useCallback(_supply => {
      if (_supply !== undefined) reset()
    }, []),
  })

  useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: noOwner ? 'tokenByIndex' : 'tokenOfOwnerByIndex',
    args: useMemo(() => {
      if (noOwner) return index ? [index?.toHexString()] : null

      return index && owner ? [owner, index?.toHexString()] : null
    }, [owner, noOwner, index]),
    provider: readProvider,
    valueDidChange: bigNumbersDiff,
    callback: useCallback(
      projectId => {
        if (
          projectId &&
          !projectIds.map(t => t.toString()).includes(projectId.toString())
        ) {
          setProjectIds([...projectIds, projectId])
          if (index?.add(1).lt(supply ?? 0)) setIndex(index?.add(1))
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
    provider: readProvider,
    valueDidChange: useCallback(
      (oldVal, newVal) => !deepEqProjectIdentifiers(oldVal, newVal),
      [],
    ),
    callback: useCallback(
      (project?: ProjectIdentifier) => {
        if (!project || !id) return

        setProjects({ ...projects, [project.handle]: project })
      },
      [projects, setProjects, id],
    ),
  })

  return projects
}
