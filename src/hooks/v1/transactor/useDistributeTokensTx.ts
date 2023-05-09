import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { BigNumber } from 'ethers'
import { TransactorInstance } from 'hooks/useTransactor'
import { useContext } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useDistributeTokensTx(): TransactorInstance {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal, tokenSymbol } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return (_, txOpts) => {
    if (!transactor || !terminal || !projectId || !contracts) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'printReservedTickets',
      [BigNumber.from(projectId).toHexString()],
      {
        ...txOpts,
        title: t`Send reserved ${tokenSymbolText({
          tokenSymbol,
          plural: true,
        })}`,
      },
    )
  }
}
