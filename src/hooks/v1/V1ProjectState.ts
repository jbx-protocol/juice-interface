import { PROJECT_TYPES } from 'constants/v1/projectTypes'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContextType } from 'contexts/v1/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useProjectsQuery } from 'hooks/Projects'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useMemo } from 'react'
import { V1CurrencyName } from 'utils/v1/currency'
import { getTerminalName, getTerminalVersion } from 'utils/v1/terminals'
import useBalanceOfProject from './contractReader/BalanceOfProject'
import useCurrentFundingCycleOfProject from './contractReader/CurrentFundingCycleOfProject'
import useCurrentPayoutModsOfProject from './contractReader/CurrentPayoutModsOfProject'
import useCurrentTicketModsOfProject from './contractReader/CurrentTicketModsOfProject'
import useOverflowOfProject from './contractReader/OverflowOfProject'
import useOwnerOfProject from './contractReader/OwnerOfProject'
import useQueuedFundingCycleOfProject from './contractReader/QueuedFundingCycleOfProject'
import useQueuedPayoutModsOfProject from './contractReader/QueuedPayoutModsOfProject'
import useQueuedTicketModsOfProject from './contractReader/QueuedTicketModsOfProject'
import useTerminalOfProject from './contractReader/TerminalOfProject'
import useTokenAddressOfProject from './contractReader/TokenAddressOfProject'

export function useV1ProjectState({
  handle,
}: {
  handle: string
}): V1ProjectContextType {
  const { projectId } = useContext(ProjectMetadataContext)

  const owner = useOwnerOfProject(projectId)
  const terminalAddress = useTerminalOfProject(projectId)
  const terminalVersion = getTerminalVersion(terminalAddress)
  const terminalName = getTerminalName({
    address: terminalAddress,
  })
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
        V1CurrencyName(currentFC?.currency.toNumber() as V1CurrencyOption),
        'ETH',
      ),
    [balance, converter, currentFC],
  )
  const overflow = useOverflowOfProject(projectId, terminalName)

  const { data: projects } = useProjectsQuery({
    projectId: projectId,
    keys: ['createdAt', 'totalPaid'],
  })

  const createdAt = projects?.[0]?.createdAt
  const earned = projects?.[0]?.totalPaid

  const project = useMemo<V1ProjectContextType>((): V1ProjectContextType => {
    const projectType = projectId ? PROJECT_TYPES[projectId] : 'standard'
    const isPreviewMode = false

    return {
      createdAt,
      projectType,
      owner,
      earned,
      handle,
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

  return project
}
