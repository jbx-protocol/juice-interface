import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import FeedbackFormLink from 'components/shared/FeedbackFormLink'

import {
  ProjectContextV1,
  ProjectContextV1Type,
} from 'contexts/v1/projectContextV1'
import { utils } from 'ethers'
import useContractReaderV1 from 'hooks/v1/ContractReaderV1'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/Projects'
import { JuiceboxV1ContractName } from 'models/contracts/juiceboxV1'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'
import { normalizeHandle } from 'utils/formatHandle'
import { getTerminalName, getTerminalVersion } from 'utils/terminal-versions'

import { padding } from 'constants/styles/padding'
import { layouts } from 'constants/styles/layouts'
import { projectTypes } from 'constants/project-types'
import { archivedProjectIds } from 'constants/archived-projects'

import Loading from '../shared/Loading'
import Project from './Project'

export default function Dashboard() {
  const [projectExists, setProjectExists] = useState<boolean>()

  const converter = useCurrencyConverter()

  const { handle }: { handle?: string } = useParams()

  const projectId = useContractReaderV1<BigNumber>({
    contract: JuiceboxV1ContractName.Projects,
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

  const terminalAddress = useContractReaderV1<string>({
    contract: JuiceboxV1ContractName.TerminalDirectory,
    functionName: 'terminalOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const terminalName = getTerminalName({
    address: terminalAddress,
  })

  const terminalVersion = getTerminalVersion(terminalAddress)

  const createdAt = projects?.[0]?.createdAt
  const earned = projects?.[0]?.totalPaid

  const owner = useContractReaderV1<string>({
    contract: JuiceboxV1ContractName.Projects,
    functionName: 'ownerOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const currentFC = useContractReaderV1<FundingCycle>({
    contract: JuiceboxV1ContractName.FundingCycles,
    functionName: 'currentOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: useCallback((a, b) => !deepEqFundingCycles(a, b), []),
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: JuiceboxV1ContractName.FundingCycles,
                eventName: 'Configure',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: terminalName,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: terminalName,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId, terminalName],
    ),
  })

  const queuedFC = useContractReaderV1<FundingCycle>({
    contract: JuiceboxV1ContractName.FundingCycles,
    functionName: 'queuedOf',
    args: projectId ? [projectId.toHexString()] : null,
    updateOn: projectId
      ? [
          {
            contract: JuiceboxV1ContractName.FundingCycles,
            eventName: 'Configure',
            topics: [[], projectId.toHexString()],
          },
        ]
      : undefined,
  })

  const uri = useContractReaderV1<string>({
    contract: JuiceboxV1ContractName.Projects,
    functionName: 'uriOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const currentPayoutMods = useContractReaderV1<PayoutMod[]>({
    contract: JuiceboxV1ContractName.ModStore,
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
                contract: JuiceboxV1ContractName.ModStore,
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

  const queuedPayoutMods = useContractReaderV1<PayoutMod[]>({
    contract: JuiceboxV1ContractName.ModStore,
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
                contract: JuiceboxV1ContractName.ModStore,
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

  const currentTicketMods = useContractReaderV1<TicketMod[]>({
    contract: JuiceboxV1ContractName.ModStore,
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
                contract: JuiceboxV1ContractName.ModStore,
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

  const queuedTicketMods = useContractReaderV1<TicketMod[]>({
    contract: JuiceboxV1ContractName.ModStore,
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
                contract: JuiceboxV1ContractName.ModStore,
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

  const tokenAddress = useContractReaderV1<string>({
    contract: JuiceboxV1ContractName.TicketBooth,
    functionName: 'ticketsOf',
    args: projectId ? [projectId.toHexString()] : null,
    updateOn: useMemo(
      () => [
        {
          contract: JuiceboxV1ContractName.TicketBooth,
          eventName: 'Issue',
          topics: projectId ? [projectId.toHexString()] : undefined,
        },
      ],
      [projectId],
    ),
  })
  const ticketContract = useErc20Contract(tokenAddress)
  const tokenSymbol = useContractReaderV1<string>({
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

  const balance = useContractReaderV1<BigNumber>({
    contract: terminalName,
    functionName: 'balanceOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: terminalName,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: terminalName,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId, terminalName],
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

  const project = useMemo<ProjectContextV1Type>(() => {
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
      terminal: {
        address: terminalAddress,
        name: terminalName,
        version: terminalVersion,
      },
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
    terminalVersion,
    terminalName,
    terminalAddress,
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
        <h2>
          <Trans>{handle} not found</Trans>
        </h2>
      </div>
    )
  }

  if (!projectId || !handle || !metadata) return null

  return (
    <ProjectContextV1.Provider value={project}>
      <div style={layouts.maxWidth}>
        <Project />
        <div
          style={{ textAlign: 'center', cursor: 'pointer', padding: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Trans>Back to top</Trans>
        </div>
        <FeedbackFormLink projectHandle={handle} />
      </div>
    </ProjectContextV1.Provider>
  )
}
