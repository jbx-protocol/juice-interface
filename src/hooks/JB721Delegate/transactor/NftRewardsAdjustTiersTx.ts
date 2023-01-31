import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/transactionContext'
import { useJB721TieredDelegate } from 'hooks/JB721Delegate/contracts/useJB721TieredDelegate'
import { TransactorInstance } from 'hooks/Transactor'
import { JB721TierParams } from 'models/nftRewardTier'
import { useContext } from 'react'

export function useNftRewardsAdjustTiersTx({
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

    // Contract expects tiers to be sorted by price.
    const newTiersAscending = newTiers.sort((a, b) => {
      if (a.contributionFloor.lt(b.contributionFloor)) return -1
      if (a.contributionFloor.gt(b.contributionFloor)) return 1
      return 0
    })

    const args = [newTiersAscending, tierIdsChanged]

    return transactor(JB721TieredDelegate, 'adjustTiers', args, {
      ...txOpts,
      title: t`NFT adjust tiers`,
    })
  }
}
