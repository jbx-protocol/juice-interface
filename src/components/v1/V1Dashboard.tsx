import ScrollToTopButton from 'components/shared/ScrollToTopButton'

import {
  V1ProjectContext,
  V1ProjectContextType,
} from 'contexts/v1/projectContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/Projects'
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
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import useUriOfProject from 'hooks/v1/contractReader/UriOfProject'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getTerminalName, getTerminalVersion } from 'utils/v1/terminals'
import { V1CurrencyProvider } from 'providers/v1/V1CurrencyProvider'
import { V1CurrencyName } from 'utils/v1/currency'
import NewDeployNotAvailable from 'components/shared/NewDeployNotAvailable'
import Project404 from 'components/shared/Project404'
import { usePageTitle } from 'hooks/PageTitle'

import { layouts } from 'constants/styles/layouts'
import { projectTypes } from 'constants/v1/projectTypes'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'

import Loading from '../shared/Loading'
import V1Project from './V1Project'

export default function V1Dashboard() {
  const { handle }: { handle?: string } = useParams()
  // Checks URL to see if user was just directed from project deploy
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const isNewDeploy = Boolean(params.get('newDeploy'))

  const projectId = useProjectIdForHandle(handle)
  const owner = useOwnerOfProject(projectId)
  const terminalAddress = useTerminalOfProject(projectId)
  const terminalName = getTerminalName({
    address: terminalAddress,
  })
  const terminalVersion = getTerminalVersion(terminalAddress)
  const currentFC = useCurrentFundingCycleOfProject(
    projectId?.toNumber(),
    terminalName,
  )
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
  const balance = useBalanceOfProject(projectId?.toNumber(), terminalName)
  const converter = useCurrencyConverter()
  const balanceInCurrency = useMemo(
    () =>
      balance &&
      converter.wadToCurrency(
        balance,
        V1CurrencyName(currentFC?.currency.toNumber() as V1CurrencyOption),
        'ETH',
      ),
    [balance, converter, currentFC],
  )
  const overflow = useOverflowOfProject(projectId, terminalName)
  const uri = useUriOfProject(projectId)
  const { data: metadata } = useProjectMetadata(uri)

  usePageTitle({
    title: metadata?.name ? `${metadata.name} | Juicebox` : undefined,
  })

  const { data: projects } = useProjectsQuery({
    projectId: projectId?.toNumber(),
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
      ? V1ArchivedProjectIds.includes(projectId.toNumber()) ||
        metadata?.archived
      : false

    return {
      createdAt,
      projectId: projectId?.toNumber(),
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
      cv: terminalVersion,
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
    if (isNewDeploy) {
      return <NewDeployNotAvailable handleOrId={handle} />
    }
    return <Project404 projectId={handle} />
  }

  if (!projectId || !handle || !metadata) return null

  return (
    <V1ProjectContext.Provider value={project}>
      <V1CurrencyProvider>
        <div style={layouts.maxWidth}>
          <V1Project />
          <div style={{ textAlign: 'center', padding: 20 }}>
            <ScrollToTopButton />
          </div>
        </div>
      </V1CurrencyProvider>
    </V1ProjectContext.Provider>
  )
}
