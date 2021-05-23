import { BigNumber } from '@ethersproject/bignumber'
import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectIdentifier } from 'models/project-identifier'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'
import { deepEqProjectIdentifiers } from 'utils/deepEqProjectIdentifiers'
import { normalizeHandle } from 'utils/formatHandle'

import Loading from '../shared/Loading'
import Project from './Project'

export default function Dashboard() {
  const [projectExists, setProjectExists] = useState<boolean>()

  const { userAddress } = useContext(UserContext)

  const { handle }: { handle?: string } = useParams()

  const projectId = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'handleResolver',
    args: useMemo(() => {
      if (!handle) return null

      let bytes = utils.formatBytes32String(normalizeHandle(handle))

      // Trim trailing zeros
      while (bytes.length && bytes.charAt(bytes.length - 1) === '0') {
        bytes = bytes.substring(0, bytes.length - 1)
      }
      // Bytes must have even length
      if (bytes.length % 2 === 1) bytes += '0'

      return [bytes]
    }, [handle]),
    callback: useCallback(
      (id?: BigNumber) => setProjectExists(id?.gt(0) ?? false),
      [setProjectExists],
    ),
  })

  const owner = useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'ownerOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const project = useContractReader<ProjectIdentifier>({
    contract: ContractName.Projects,
    functionName: 'getInfo',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: useCallback(
      (oldVal, newVal) => !deepEqProjectIdentifiers(oldVal, newVal),
      [],
    ),
  })

  const fundingCycle = useContractReader<FundingCycle>({
    contract: ContractName.FundingCycles,
    functionName: 'getCurrent',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: (a, b) => !deepEqFundingCycles(a, b),
    updateOn: projectId
      ? [
          {
            contract: ContractName.Juicer,
            eventName: 'Reconfigure',
            topics: [[], projectId.toHexString()],
          },
          {
            contract: ContractName.Juicer,
            eventName: 'Pay',
            topics: [[], projectId.toHexString()],
          },
          {
            contract: ContractName.Juicer,
            eventName: 'Tap',
            topics: [[], projectId.toHexString()],
          },
        ]
      : undefined,
  })

  const isOwner = userAddress === owner

  if (projectExists === undefined) return <Loading />

  if (!projectExists) {
    return (
      <div
        style={{
          padding: padding.app,
          height: '100%',
          ...layouts.centered,
        }}
      >
        <h2>{handle} not found</h2>
      </div>
    )
  }

  if (!projectId) return null

  return (
    <div style={layouts.maxWidth}>
      <Project
        isOwner={isOwner}
        projectId={projectId}
        project={project}
        fundingCycle={fundingCycle}
      />
    </div>
  )
}
