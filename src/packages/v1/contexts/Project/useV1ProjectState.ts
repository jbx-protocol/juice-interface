import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectsQuery } from 'generated/graphql'
import useSymbolOfERC20 from 'hooks/ERC20/useSymbolOfERC20'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { client } from 'lib/apollo/client'
import { V1ProjectContextType } from 'packages/v1/contexts/Project/V1ProjectContext'
import useBalanceOfProject from 'packages/v1/hooks/contractReader/useBalanceOfProject'
import useCurrentFundingCycleOfProject from 'packages/v1/hooks/contractReader/useCurrentFundingCycleOfProject'
import useCurrentPayoutModsOfProject from 'packages/v1/hooks/contractReader/useCurrentPayoutModsOfProject'
import useCurrentTicketModsOfProject from 'packages/v1/hooks/contractReader/useCurrentTicketModsOfProject'
import useOverflowOfProject from 'packages/v1/hooks/contractReader/useOverflowOfProject'
import useOwnerOfProject from 'packages/v1/hooks/contractReader/useOwnerOfProject'
import useQueuedFundingCycleOfProject from 'packages/v1/hooks/contractReader/useQueuedFundingCycleOfProject'
import useQueuedPayoutModsOfProject from 'packages/v1/hooks/contractReader/useQueuedPayoutModsOfProject'
import useQueuedTicketModsOfProject from 'packages/v1/hooks/contractReader/useQueuedTicketModsOfProject'
import useTerminalOfProject from 'packages/v1/hooks/contractReader/useTerminalOfProject'
import useTokenAddressOfProject from 'packages/v1/hooks/contractReader/useTokenAddressOfProject'
import { useV1TerminalVersion } from 'packages/v1/hooks/contractReader/useV1TerminalVersion'
import { V1CurrencyOption } from 'packages/v1/models/currencyOption'
import { V1CurrencyName } from 'packages/v1/utils/currency'
import { useContext, useMemo } from 'react'

export function useV1ProjectState({
  handle,
}: {
  handle: string
}): V1ProjectContextType {
  const { projectId } = useContext(ProjectMetadataContext)

  const owner = useOwnerOfProject(projectId)
  const terminalAddress = useTerminalOfProject(projectId)
  const { version: terminalVersion, name: terminalName } = useV1TerminalVersion(
    { terminalAddress },
  )
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
  const { data: tokenSymbol } = useSymbolOfERC20(tokenAddress)
  const balance = useBalanceOfProject(projectId, terminalName)
  const converter = useCurrencyConverter()
  const balanceInCurrency = useMemo(
    () =>
      balance &&
      converter.wadToCurrency(
        balance,
        currentFC
          ? V1CurrencyName(Number(currentFC.currency) as V1CurrencyOption)
          : undefined,
        'ETH',
      ),
    [balance, converter, currentFC],
  )
  const overflow = useOverflowOfProject(projectId, terminalName)

  const { data } = useProjectsQuery({
    client,
    variables: {
      where: {
        projectId,
        pv: PV_V1,
      },
    },
  })

  const projects = data?.projects
  const createdAt = projects?.[0]?.createdAt
  const earned = projects?.[0]?.volume

  const project = useMemo<V1ProjectContextType>((): V1ProjectContextType => {
    const projectType = 'standard'

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
