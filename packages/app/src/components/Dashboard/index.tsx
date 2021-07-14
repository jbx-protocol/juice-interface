import { BigNumber } from '@ethersproject/bignumber'
import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { PaymentMod, TicketMod } from 'models/mods'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'
import { normalizeHandle } from 'utils/formatHandle'

import Loading from '../shared/Loading'
import Project from './Project'

export default function Dashboard() {
  const [projectExists, setProjectExists] = useState<boolean>()

  const { userAddress } = useContext(UserContext)

  const { handle }: { handle?: string } = useParams()

  const projectId = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: handle ? [utils.formatBytes32String(normalizeHandle(handle))] : null,
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

  const fundingCycle = useContractReader<FundingCycle>({
    contract: ContractName.FundingCycles,
    functionName: 'currentOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: useCallback((a, b) => !deepEqFundingCycles(a, b), []),
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.FundingCycles,
                eventName: 'Configure',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.TerminalV1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.TerminalV1,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [],
    ),
  })

  const uri = useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'uriOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const paymentMods = useContractReader<PaymentMod[]>({
    contract: ContractName.ModStore,
    functionName: 'paymentModsOf',
    args:
      projectId && fundingCycle
        ? [projectId.toHexString(), fundingCycle.configured.toHexString()]
        : null,
    updateOn: useMemo(
      () =>
        projectId && fundingCycle
          ? [
              {
                contract: ContractName.ModStore,
                eventName: 'SetPaymentMod',
                topics: [
                  projectId.toHexString(),
                  fundingCycle.configured.toHexString(),
                ],
              },
            ]
          : [],
      [projectId, fundingCycle],
    ),
  })

  const ticketMods = useContractReader<TicketMod[]>({
    contract: ContractName.ModStore,
    functionName: 'ticketModsOf',
    args:
      projectId && fundingCycle
        ? [projectId.toHexString(), fundingCycle.configured.toHexString()]
        : null,
    updateOn: useMemo(
      () =>
        projectId && fundingCycle
          ? [
              {
                contract: ContractName.ModStore,
                eventName: 'SetTicketMod',
                topics: [
                  projectId.toHexString(),
                  fundingCycle.configured.toHexString(),
                ],
              },
            ]
          : [],
      [projectId, fundingCycle],
    ),
  })

  const metadata = useProjectMetadata(uri)

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

  if (!projectId || !handle || !metadata) return null

  return (
    <div style={layouts.maxWidth}>
      <Project
        handle={handle}
        metadata={metadata}
        isOwner={isOwner}
        projectId={projectId}
        fundingCycle={fundingCycle}
        paymentMods={paymentMods}
        ticketMods={ticketMods}
      />
    </div>
  )
}
