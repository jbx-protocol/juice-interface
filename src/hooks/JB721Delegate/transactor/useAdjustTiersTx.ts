import { t } from '@lingui/macro'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { TransactorInstance } from 'hooks/useTransactor'
import {
  JB721TierParams,
  JB_721_TIER_PARAMS_V3_1,
  JB_721_TIER_PARAMS_V3_2,
} from 'models/nftRewards'
import { useContext } from 'react'

export function useAdjustTiersTx(): TransactorInstance<{
  newTiers: (
    | JB721TierParams
    | JB_721_TIER_PARAMS_V3_1
    | JB_721_TIER_PARAMS_V3_2
  )[]
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

    const args = [
      newTiers, // _tiersToAdd
      tierIdsChanged, // _tierIdsToRemove
    ]

    return transactor(JB721TieredDelegate, 'adjustTiers', args, {
      ...txOpts,
      title: t`Editing NFTs`,
    })
  }
}
