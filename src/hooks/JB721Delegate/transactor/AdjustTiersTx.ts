import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { useJB721TieredDelegate } from 'hooks/JB721Delegate/contracts/JB721TieredDelegate'
import { TransactorInstance } from 'hooks/Transactor'
import { JB721TierParams } from 'models/nftRewardTier'
import { useContext } from 'react'

export function useAdjustTiersTx({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): TransactorInstance<{
  newTiers: JB721TierParams[]
  tierIdsChanged: number[]
}> {
  const { transactor } = useContext(TransactionContext)
  const JB721TieredDelegate = useJB721TieredDelegate({
    address: dataSourceAddress,
  })

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
