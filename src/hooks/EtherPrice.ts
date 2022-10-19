import { CV_V3 } from 'constants/cv'
import { WAD_DECIMALS } from 'constants/numbers'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useEffect } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { useContractReadValue } from './ContractReader'
import { useLoadV2V3Contract } from './v2v3/LoadV2V3Contract'

/**
 * Chainlink feed doesn't tend to up date that quickly.
 * Refresh every 5 minutes.
 */
const PRICE_REFRESH_INTERVAL = 60 * 1000 * 5 // 5 minutes

/**
 * Return the current price of ETH in USD.
 * @example 1234.69
 */
export function useEtherPrice() {
  const JBPrices = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBPrices,
  })

  const { refetchValue, value: price } = useContractReadValue({
    contract: JBPrices,
    functionName: 'priceFor',
    args: [V2V3_CURRENCY_USD, V2V3_CURRENCY_ETH, WAD_DECIMALS],
    formatter: val => {
      if (!val) return
      return parseFloat(fromWad(val))
    },
  })

  useEffect(() => {
    const timer = setInterval(refetchValue, PRICE_REFRESH_INTERVAL)
    return () => clearInterval(timer)
  }, [refetchValue])

  return price ?? 0
}
