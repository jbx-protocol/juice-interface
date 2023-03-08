import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { isZeroAddress } from 'utils/address'

/**
 * Checks if a given funding cycle has a datasource and if it is set to use the datasource for pay.
 */
function hasDataSourceForPay(
  fundingCycleMetadata: V2V3FundingCycleMetadata | undefined,
) {
  return Boolean(
    !isZeroAddress(fundingCycleMetadata?.dataSource) &&
      fundingCycleMetadata?.useDataSourceForPay,
  )
}

export function useHasNftRewards(): { value: boolean; loading: boolean } {
  const {
    fundingCycleMetadata,
    loading: { fundingCycleLoading },
  } = useContext(V2V3ProjectContext)
  const { version: JB721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )

  return {
    value:
      hasDataSourceForPay(fundingCycleMetadata) &&
      Boolean(JB721DelegateVersion),
    loading: fundingCycleLoading,
  }
}
