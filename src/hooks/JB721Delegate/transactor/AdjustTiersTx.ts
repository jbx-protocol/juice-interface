import { t } from '@lingui/macro'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { JB721TierParams } from 'models/nftRewards'
import { useContext } from 'react'

export function useAdjustTiersTx(): TransactorInstance<{
  newTiers: JB721TierParams[]
  tierIdsChanged: number[]
}> {
  const { transactor } = useContext(TransactionContext)
  const {
    contracts: { JB721TieredDelegate },
  } = useContext(JB721DelegateContractsContext)

  return async ({ newTiers, tierIdsChanged }, txOpts) => {
    if (!transactor || !JB721TieredDelegate) {
      const missingParam = !transactor
        ? 'transactor'
        : !JB721TieredDelegate
        ? 'JB721TieredDelegate'
        : null
      txOpts?.onError?.(
        new DOMException(
          `Transaction failed, missing argument "${
            missingParam ?? '<unknown>'
          }".`,
        ),
      )

      return Promise.resolve(false)
    }

    const args = [newTiers, tierIdsChanged]

    return transactor(JB721TieredDelegate, 'adjustTiers', args, {
      ...txOpts,
      title: t`Editing NFTs`,
    })
  }
}
