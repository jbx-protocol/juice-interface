import { Trans } from '@lingui/macro'
import FeedbackFormLink from 'components/shared/FeedbackFormLink'

import { ProjectContext, ProjectContextType } from 'contexts/projectContext'
import useBalanceOfProject from 'hooks/contractReader/BalanceOfProject'
import useCurrentFundingCycleOfProject from 'hooks/contractReader/CurrentFundingCycleOfProject'
import useCurrentPayoutModsOfProject from 'hooks/contractReader/CurrentPayoutModsOfProject'
import useCurrentTicketModsOfProject from 'hooks/contractReader/CurrentTicketModsOfProject'
import useOverflowOfProject from 'hooks/contractReader/OverflowOfProject'
import useOwnerOfProject from 'hooks/contractReader/OwnerOfProject'
import useProjectIdForHandle from 'hooks/contractReader/ProjectIdForHandle'
import useQueuedFundingCycleOfProject from 'hooks/contractReader/QueuedFundingCycleOfProject'
import useQueuedPayoutModsOfProject from 'hooks/contractReader/QueuedPayoutModsOfProject'
import useQueuedTicketModsOfProject from 'hooks/contractReader/QueuedTicketModsOfProject'
import useSymbolOfERC20 from 'hooks/contractReader/SymbolOfERC20'
import useTokenAddressOfProject from 'hooks/contractReader/TokenAddressOfProject'
import useUriOfProject from 'hooks/contractReader/UriOfProject'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/Projects'
import { CurrencyOption } from 'models/currency-option'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getTerminalName, getTerminalVersion } from 'utils/v1/terminals'

import { padding } from 'constants/styles/padding'
import { layouts } from 'constants/styles/layouts'
import { projectTypes } from 'constants/project-types'
import { archivedProjectIds } from 'constants/archived-projects'

import useTerminalOfProject from '../../hooks/contractReader/TerminalOfProject'
import Loading from '../shared/Loading'
import Project from './Project'

export default function Dashboard() {
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
    <ProjectContext.Provider value={project}>
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
    </ProjectContext.Provider>
  )
}
