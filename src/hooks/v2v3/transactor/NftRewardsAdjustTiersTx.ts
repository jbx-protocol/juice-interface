import * as constants from '@ethersproject/constants'

import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'
import { buildJB721TierParams } from 'utils/nftRewards'
import { loadJBTiered721DelegateContract } from 'utils/v2v3/contractLoaders/JBTiered721Delegate'
import { TxNftArg } from './LaunchProjectWithNftsTx'

export function useNftRewardsAdjustTiersTx(): TransactorInstance<{
  dataSourceAddress: string | undefined
  nftRewards: TxNftArg
  tierIdsChanged: number[]
}> {
  const { transactor } = useContext(TransactionContext)

  return async ({ dataSourceAddress, nftRewards, tierIdsChanged }, txOpts) => {
    const hasDataSource =
      dataSourceAddress && dataSourceAddress !== constants.AddressZero
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
    const args = [buildJB721TierParams(nftRewards), tierIdsChanged]
    const dataSourceContract = await loadJBTiered721DelegateContract(
      dataSourceAddress,
    )
    return transactor(dataSourceContract, 'adjustTiers', args, {
      ...txOpts,
      title: t`NFT adjust tiers`,
    })
  }
}
