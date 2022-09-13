import { V1UserContext } from 'contexts/v1/userContext'
import { V1ContractName } from 'models/v1/contracts'
import { useContext, useEffect } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { useContractReadValue } from './ContractReader'

export function useEtherPrice() {
  const { contracts } = useContext(V1UserContext)

  const { refetchValue, value: price } = useContractReadValue({
    contracts,
    contract: V1ContractName.Prices,
    functionName: 'getETHPriceFor',
    args: ['1'], // $1 USD
    formatter: val => {
      if (!val) return
      return parseFloat(fromWad(val))
    },
  })

  useEffect(() => {
    const timer = setInterval(refetchValue, 5000)
    return () => clearInterval(timer)
  })

  return price ?? 0
}
