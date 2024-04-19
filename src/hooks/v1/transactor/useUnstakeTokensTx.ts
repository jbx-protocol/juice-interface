import { t } from '@lingui/macro'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { toHexString } from 'utils/bigNumbers'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useUnstakeTokensTx(): TransactorInstance<{
  unstakeAmount: bigint
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { userAddress } = useWallet()
  const { tokenSymbol } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ unstakeAmount }, txOpts) => {
    if (!transactor || !userAddress || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TicketBooth,
      'unstake',
      [userAddress, toHexString(BigInt(projectId)), toHexString(unstakeAmount)],
      {
        ...txOpts,
        title: t`Unstake ${tokenSymbolText({
          tokenSymbol,
          plural: true,
        })}`,
      },
    )
  }
}
