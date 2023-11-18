/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react-hooks'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { BigNumber } from 'ethers'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { useDistributableAmount } from './useDistributableAmount'
import { useTreasuryStats } from './useTreasuryStats'

jest.mock(
  'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext',
)
jest.mock('./useDistributableAmount')

describe('useTreasuryStats', () => {
  const DefaultProjectContext = {
    distributionLimit: parseWad('100'),
    distributionLimitCurrency: BigNumber.from(V2V3_CURRENCY_ETH),
    balanceInDistributionLimitCurrency: parseWad('100'),
    primaryTerminalCurrentOverflow: parseWad('0'),
  }
  const DefaultUseDistributableAmount = {
    distributableAmount: parseWad('100'),
  }
  beforeEach(() => {
    ;(useProjectContext as jest.Mock).mockReturnValue(DefaultProjectContext)
    ;(useDistributableAmount as jest.Mock).mockReturnValue(
      DefaultUseDistributableAmount,
    )
  })

  it('returns undefined treasuryBalance if balanceInDistributionLimitCurrency is undefined', () => {
    ;(useProjectContext as jest.Mock).mockReturnValue({
      ...DefaultProjectContext,
      balanceInDistributionLimitCurrency: undefined,
    })
    const { result } = renderHook(useTreasuryStats)
    expect(result.current.treasuryBalance).toBeUndefined()
  })

  it('returns undefined overflow if distributionLimit is undefined', () => {
    ;(useProjectContext as jest.Mock).mockReturnValue({
      ...DefaultProjectContext,
      distributionLimit: undefined,
    })
    const { result } = renderHook(useTreasuryStats)
    expect(result.current.overflow).toBeUndefined()
  })

  it('returns no overflow if distribution limit is MAX_DISTRIBUTION_LIMIT', () => {
    ;(useProjectContext as jest.Mock).mockReturnValue({
      ...DefaultProjectContext,
      distributionLimit: BigNumber.from(MAX_DISTRIBUTION_LIMIT),
    })
    const { result } = renderHook(useTreasuryStats)
    expect(result.current.overflow).toEqual('No overflow')
  })
})
