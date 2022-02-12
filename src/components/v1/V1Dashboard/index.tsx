import { Trans } from '@lingui/macro'
import FeedbackFormLink from 'components/shared/FeedbackFormLink'

import {
  V1ProjectContext,
  V1ProjectContextType,
} from 'contexts/v1/projectContext'
import useBalanceOfProject from 'hooks/v1/contractReader/BalanceOfProject'
import useCurrentFundingCycleOfProject from 'hooks/v1/contractReader/CurrentFundingCycleOfProject'
import useCurrentPayoutModsOfProject from 'hooks/v1/contractReader/CurrentPayoutModsOfProject'
import useCurrentTicketModsOfProject from 'hooks/v1/contractReader/CurrentTicketModsOfProject'
import useOverflowOfProject from 'hooks/v1/contractReader/OverflowOfProject'
import useOwnerOfProject from 'hooks/v1/contractReader/OwnerOfProject'
import useProjectIdForHandle from 'hooks/v1/contractReader/ProjectIdForHandle'
import useQueuedFundingCycleOfProject from 'hooks/v1/contractReader/QueuedFundingCycleOfProject'
import useQueuedPayoutModsOfProject from 'hooks/v1/contractReader/QueuedPayoutModsOfProject'
import useQueuedTicketModsOfProject from 'hooks/v1/contractReader/QueuedTicketModsOfProject'
import useSymbolOfERC20 from 'hooks/v1/contractReader/SymbolOfERC20'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import useUriOfProject from 'hooks/v1/contractReader/UriOfProject'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/v1/Projects'
import { CurrencyOption } from 'models/currency-option'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getTerminalName, getTerminalVersion } from 'utils/v1/terminals'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'

import ScrollToTopButton from 'components/shared/ScrollToTopButton'

import { padding } from 'constants/styles/padding'
import { layouts } from 'constants/styles/layouts'
import { projectTypes } from 'constants/v1/projectTypes'
import { archivedProjectIds } from 'constants/v1/archivedProjects'

import Loading from '../../shared/Loading'
import V1Project from '../V1Project'

export default function V1Dashboard() {
  const { handle }: { handle?: string } = useParams()

  const projectId = useProjectIdForHandle(handle)
  const owner = useOwnerOfProject(projectId)
  const terminalAddress = useTerminalOfProject(projectId)
  const terminalName = getTerminalName({
    address: terminalAddress,
  })
  const terminalVersion = getTerminalVersion(terminalAddress)
  const currentFC = useCurrentFundingCycleOfProject(projectId, terminalName)
  const queuedFC = useQueuedFundingCycleOfProject(projectId)
  const currentPayoutMods = useCurrentPayoutModsOfProject(
    projectId,
    currentFC?.configured,
  )
  const queuedPayoutMods = useQueuedPayoutModsOfProject(
    projectId,
    queuedFC?.configured,
  )
  const currentTicketMods = useCurrentTicketModsOfProject(
    projectId,
    currentFC?.configured,
  )
  const queuedTicketMods = useQueuedTicketModsOfProject(
    projectId,
    queuedFC?.configured,
  )
  const tokenAddress = useTokenAddressOfProject(projectId)
  const tokenSymbol = useSymbolOfERC20(tokenAddress)
  const balance = useBalanceOfProject(projectId, terminalName)
  const converter = useCurrencyConverter()
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
  const overflow = useOverflowOfProject(projectId, terminalName)
  const uri = useUriOfProject(projectId)
  const { data: metadata } = useProjectMetadata(uri)

  useEffect(() => {
    if (metadata?.name) {
      document.title = metadata.name
    } else {
      document.title = 'Juicebox'
    }
  }, [metadata])

  const { data: projects } = useProjectsQuery({
    projectId,
    keys: ['createdAt', 'totalPaid'],
  })

  const createdAt = projects?.[0]?.createdAt
  const earned = projects?.[0]?.totalPaid

  const project = useMemo<V1ProjectContextType>(() => {
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
      overflow,
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
    overflow,
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

  if (!projectId) return <Loading />

  if (projectId?.eq(0)) {
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
    <V1ProjectContext.Provider value={project}>
      <div style={layouts.maxWidth}>
        <V1Project />

        <div style={{ textAlign: 'center', padding: 20 }}>
          <ScrollToTopButton />
        </div>
        <FeedbackFormLink projectHandle={handle} />
      </div>
    </V1ProjectContext.Provider>
  )
}
