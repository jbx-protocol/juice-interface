import { ContractNftRewardTier } from 'models/v2/nftRewardTier'

import { MAX_NFT_REWARD_TIERS } from 'components/v2/shared/FundingCycleConfigurationDrawers/NftDrawer'
import { V2ContractName } from 'models/v2/contracts'
import * as constants from '@ethersproject/constants'

import useV2ContractReader from './V2ContractReader'

export function useNftRewardTiersOf(dataSourceAddress: string | undefined) {
  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  return useV2ContractReader<ContractNftRewardTier[]>({
    contract: V2ContractName.JBTiered721DelegateStore,
    functionName: 'tiers',
    // send null when project has no dataSource, so the fetch doesn't execute.
    args: hasDataSource ? [dataSourceAddress, 0, MAX_NFT_REWARD_TIERS] : null,
  })
}
