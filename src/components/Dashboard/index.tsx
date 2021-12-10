import { BigNumber } from '@ethersproject/bignumber'

import { ProjectContext, ProjectContextType } from 'contexts/projectContext'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'
import { normalizeHandle } from 'utils/formatHandle'

import { padding } from 'constants/styles/padding'
import { layouts } from 'constants/styles/layouts'
import { projectTypes } from 'constants/project-types'
import { archivedProjectIds } from 'constants/archived-projects'

import Loading from '../shared/Loading'
import Project from './Project'
import { useProjectsQuery } from '../../hooks/Projects'

export default function Dashboard() {
  const [projectExists, setProjectExists] = useState<boolean>()

  const converter = useCurrencyConverter()

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

  const { data: projects } = useProjectsQuery({
    projectId,
    keys: ['createdAt', 'totalPaid'],
  })

  const createdAt = projects?.[0]?.createdAt
  const earned = projects?.[0]?.totalPaid

  const owner = useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'ownerOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const currentFC = useContractReader<FundingCycle>({
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
                contract: ContractName.TerminalV1_1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.TerminalV1_1,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  const queuedFC = useContractReader<FundingCycle>({
    contract: ContractName.FundingCycles,
    functionName: 'queuedOf',
    args: projectId ? [projectId.toHexString()] : null,
    updateOn: projectId
      ? [
          {
            contract: ContractName.FundingCycles,
            eventName: 'Configure',
            topics: [[], projectId.toHexString()],
          },
        ]
      : undefined,
  })

  const uri = useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'uriOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const currentPayoutMods = useContractReader<PayoutMod[]>({
    contract: ContractName.ModStore,
    functionName: 'payoutModsOf',
    args:
      projectId && currentFC
        ? [projectId.toHexString(), currentFC.configured.toHexString()]
        : null,
    updateOn: useMemo(
      () =>
        projectId && currentFC
          ? [
              {
                contract: ContractName.ModStore,
                eventName: 'SetPayoutMod',
                topics: [
                  projectId.toHexString(),
                  currentFC.configured.toHexString(),
                ],
              },
            ]
          : [],
      [projectId, currentFC],
    ),
  })

  const queuedPayoutMods = useContractReader<PayoutMod[]>({
    contract: ContractName.ModStore,
    functionName: 'payoutModsOf',
    args:
      projectId && queuedFC
        ? [projectId.toHexString(), queuedFC.configured.toHexString()]
        : null,
    updateOn: useMemo(
      () =>
        projectId && queuedFC
          ? [
              {
                contract: ContractName.ModStore,
                eventName: 'SetPayoutMod',
                topics: [
                  projectId.toHexString(),
                  queuedFC.configured.toHexString(),
                ],
              },
            ]
          : [],
      [projectId, queuedFC],
    ),
  })

  const currentTicketMods = useContractReader<TicketMod[]>({
    contract: ContractName.ModStore,
    functionName: 'ticketModsOf',
    args:
      projectId && currentFC
        ? [projectId.toHexString(), currentFC.configured.toHexString()]
        : null,
    updateOn: useMemo(
      () =>
        projectId && currentFC
          ? [
              {
                contract: ContractName.ModStore,
                eventName: 'SetTicketMod',
                topics: [
                  projectId.toHexString(),
                  currentFC.configured.toHexString(),
                ],
              },
            ]
          : [],
      [projectId, currentFC],
    ),
  })

  const queuedTicketMods = useContractReader<TicketMod[]>({
    contract: ContractName.ModStore,
    functionName: 'ticketModsOf',
    args:
      projectId && queuedFC
        ? [projectId.toHexString(), queuedFC.configured.toHexString()]
        : null,
    updateOn: useMemo(
      () =>
        projectId && queuedFC
          ? [
              {
                contract: ContractName.ModStore,
                eventName: 'SetTicketMod',
                topics: [
                  projectId.toHexString(),
                  queuedFC.configured.toHexString(),
                ],
              },
            ]
          : [],
      [projectId, queuedFC],
    ),
  })

  const tokenAddress = useContractReader<string>({
    contract: ContractName.TicketBooth,
    functionName: 'ticketsOf',
    args: projectId ? [projectId.toHexString()] : null,
    updateOn: useMemo(
      () => [
        {
          contract: ContractName.TicketBooth,
          eventName: 'Issue',
          topics: projectId ? [projectId.toHexString()] : undefined,
        },
      ],
      [projectId],
    ),
  })
  const ticketContract = useErc20Contract(tokenAddress)
  const tokenSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
  })

  const { data: metadata } = useProjectMetadata(uri)

  useEffect(() => {
    if (metadata?.name) {
      document.title = metadata.name
    } else {
      document.title = 'Juicebox'
    }
  }, [metadata])

  const balance = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1_1,
    functionName: 'balanceOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.TerminalV1_1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.TerminalV1_1,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  const balanceInCurrency = useMemo(
    () =>
      balance &&
      converter.wadToCurrency(
        balance,
        currentFC?.currency.toNumber() as CurrencyOption,
        0,
      ),
    [balance, converter, currentFC],
  )

  const project = useMemo<ProjectContextType>(() => {
    const projectType = projectId
      ? projectTypes[projectId.toNumber()]
      : 'standard'
    const isPreviewMode = false
    const isArchived = projectId
      ? archivedProjectIds.includes(projectId.toNumber())
      : false

    return {
      createdAt,
      projectId,
      projectType,
      owner,
      earned,
      handle,
      metadata,
      currentFC,
      queuedFC,
      currentPayoutMods,
      currentTicketMods,
      queuedPayoutMods,
      queuedTicketMods,
      tokenAddress,
      tokenSymbol,
      balance,
      balanceInCurrency,
      isPreviewMode,
      isArchived,
    }
  }, [
    balance,
    balanceInCurrency,
    createdAt,
    currentFC,
    currentPayoutMods,
    currentTicketMods,
    earned,
    handle,
    metadata,
    owner,
    projectId,
    queuedFC,
    queuedPayoutMods,
    queuedTicketMods,
    tokenAddress,
    tokenSymbol,
  ])

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
    <ProjectContext.Provider value={project}>
      <div style={layouts.maxWidth}>
        <Project />
        <div
          style={{ textAlign: 'center', cursor: 'pointer', padding: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top
        </div>
      </div>
    </ProjectContext.Provider>
  )
}
