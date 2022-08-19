import { Contract } from '@ethersproject/contracts'
import * as constants from '@ethersproject/constants'
import { useMemo } from 'react'
import { ContractNftRewardTier } from 'models/v2/nftRewardTier'
import { featureFlagEnabled } from 'utils/featureFlags'

import { TEMPORARY_NFT_DATASOURCE_ABI } from 'constants/contracts/rinkeby/TEMPORARY_NFT_DATASOUCE_ABI'
import { readProvider } from 'constants/readProvider'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import useV2ContractReader from './V2ContractReader'

export function useNftRewardTiersOf(dataSourceAddress: string | undefined) {
  const dataSourceContract = useMemo(
    () =>
      new Contract(
        dataSourceAddress ?? constants.AddressZero,
        TEMPORARY_NFT_DATASOURCE_ABI,
        readProvider,
      ),
    [dataSourceAddress],
  )

  return useV2ContractReader<ContractNftRewardTier[]>({
    contract: dataSourceContract,
    functionName: 'allTiers',
    // send null when FF disabled, so the fetch doesn't execute.
    args: featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS) ? undefined : null,
  })
}
