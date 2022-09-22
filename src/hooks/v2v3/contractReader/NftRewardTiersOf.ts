import { ContractNftRewardTier } from 'models/nftRewardTier'

import * as constants from '@ethersproject/constants'
import { V2V3ContractName } from 'models/v2v3/contracts'

import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import useV2ContractReader from './V2ContractReader'

export function useNftRewardTiersOf(dataSourceAddress: string | undefined) {
  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  return useV2ContractReader<ContractNftRewardTier[]>({
    contract: V2V3ContractName.JBTiered721DelegateStore,
    functionName: 'tiers',
    // send null when project has no dataSource, so the fetch doesn't execute.
    args: hasDataSource ? [dataSourceAddress, 0, MAX_NFT_REWARD_TIERS] : null,
  })
}
