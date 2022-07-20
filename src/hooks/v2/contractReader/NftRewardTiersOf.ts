import { Contract } from '@ethersproject/contracts'
import * as constants from '@ethersproject/constants'
import { useMemo } from 'react'

import useV2ContractReader from './V2ContractReader'
import { ContractNftRewardTier } from '../transactor/LaunchProjectWithNftsTx'
import { TEMPORARY_NFT_DATASOURCE_ABI } from 'constants/contracts/rinkeby/TEMPORARY_NFT_DATASOUCE_ABI'
import { readProvider } from 'constants/readProvider'

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
  })
}
