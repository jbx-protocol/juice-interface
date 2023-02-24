import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { isZeroAddress } from 'utils/address'
import { useIsJB721DelegateV1 } from './IsJB721DelegateV1'
import { useIsJB721DelegateV1_1 } from './IsJB721DelegateV1_1'

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
  const { value: supportsV1Interface, loading: v1Loading } =
    useIsJB721DelegateV1({
      dataSourceAddress: fundingCycleMetadata?.dataSource,
    })
  const { value: supportsV1_1Interface, loading: v1_1Loading } =
    useIsJB721DelegateV1_1({
      dataSourceAddress: fundingCycleMetadata?.dataSource,
    })

  return {
    value:
      hasDataSourceForPay(fundingCycleMetadata) &&
      (supportsV1Interface || supportsV1_1Interface),
    loading: fundingCycleLoading || v1Loading || v1_1Loading,
  }
}
