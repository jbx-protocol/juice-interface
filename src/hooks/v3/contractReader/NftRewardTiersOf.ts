import * as constants from '@ethersproject/constants'
import { ContractNftRewardTier } from 'models/nftRewardTier'
import { V3ContractName } from 'models/v3/contracts'
import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import useV3ContractReader from './V3ContractReader'

export function useNftRewardTiersOf(dataSourceAddress: string | undefined) {
  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  return useV3ContractReader<ContractNftRewardTier[]>({
    contract: V3ContractName.JBTiered721DelegateStore,
    functionName: 'tiers',
    // send null when project has no dataSource, so the fetch doesn't execute.
    args: hasDataSource ? [dataSourceAddress, 0, MAX_NFT_REWARD_TIERS] : null,
  })
}
