import * as constants from '@ethersproject/constants'

import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { JB721TierParams } from 'models/nftRewardTier'
import { useContext } from 'react'

export function useNftRewardsAdjustTiersTx(): TransactorInstance<{
  dataSourceContract: Contract
  newTiers: JB721TierParams[]
  tierIdsChanged: number[]
}> {
  const { transactor } = useContext(TransactionContext)

  return async ({ dataSourceContract, newTiers, tierIdsChanged }, txOpts) => {
    const hasDataSource =
      dataSourceContract.address &&
      dataSourceContract.address !== constants.AddressZero
    if (!transactor || !hasDataSource) {
      const missingParam = !transactor
        ? 'transactor'
        : !hasDataSource
        ? 'dataSource'
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
    return transactor(dataSourceContract, 'adjustTiers', args, {
      ...txOpts,
      title: t`NFT adjust tiers`,
    })
  }
}
