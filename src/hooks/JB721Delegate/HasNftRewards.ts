import * as constants from '@ethersproject/constants'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { useIsJB721DelegateV1 } from './IsJB721DelegateV1'
import { useIsJB721DelegateV1_1 } from './IsJB721DelegateV1_1'

/**
 * Checks if a given funding cycle has a datasource and if it is set to use the datasource for pay.
 */
function hasDataSourceForPay(
  fundingCycleMetadata: V2V3FundingCycleMetadata | undefined,
) {
  return Boolean(
    fundingCycleMetadata?.dataSource &&
      fundingCycleMetadata.dataSource !== constants.AddressZero &&
      fundingCycleMetadata?.useDataSourceForPay,
  )
}

export function useHasNftRewards(): boolean {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const supportsV1Interface = useIsJB721DelegateV1({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })
  const supportsV1_1Interface = useIsJB721DelegateV1_1({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

  return (
    hasDataSourceForPay(fundingCycleMetadata) &&
    (supportsV1Interface || supportsV1_1Interface)
  )
}
