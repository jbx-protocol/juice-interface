import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContextType } from 'contexts/v1/Project/V1ProjectContext'
import { useProjectsQuery } from 'generated/graphql'
import useSymbolOfERC20 from 'hooks/ERC20/useSymbolOfERC20'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import useBalanceOfProject from 'hooks/v1/contractReader/useBalanceOfProject'
import useCurrentFundingCycleOfProject from 'hooks/v1/contractReader/useCurrentFundingCycleOfProject'
import useCurrentPayoutModsOfProject from 'hooks/v1/contractReader/useCurrentPayoutModsOfProject'
import useCurrentTicketModsOfProject from 'hooks/v1/contractReader/useCurrentTicketModsOfProject'
import useOverflowOfProject from 'hooks/v1/contractReader/useOverflowOfProject'
import useOwnerOfProject from 'hooks/v1/contractReader/useOwnerOfProject'
import useQueuedFundingCycleOfProject from 'hooks/v1/contractReader/useQueuedFundingCycleOfProject'
import useQueuedPayoutModsOfProject from 'hooks/v1/contractReader/useQueuedPayoutModsOfProject'
import useQueuedTicketModsOfProject from 'hooks/v1/contractReader/useQueuedTicketModsOfProject'
import useTerminalOfProject from 'hooks/v1/contractReader/useTerminalOfProject'
import useTokenAddressOfProject from 'hooks/v1/contractReader/useTokenAddressOfProject'
import { useV1TerminalVersion } from 'hooks/v1/contractReader/useV1TerminalVersion'
import { client } from 'lib/apollo/client'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useMemo } from 'react'
import { V1CurrencyName } from 'utils/v1/currency'

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
        V1CurrencyName(currentFC?.currency.toNumber() as V1CurrencyOption),
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
