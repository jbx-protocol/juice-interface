import { Contract } from '@ethersproject/contracts'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { NetworkName } from 'models/network-name'
import { useEffect, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { useContractReadValue } from './ContractReader'
import { loadV1Contract } from './v1/V1ContractLoader'

/**
 * Chainlink feed doesn't tend to up date that quickly.
 * Refresh every 5 minutes.
 */
const PRICE_REFRESH_INTERVAL = 60 * 1000 * 5 // 5 minutes

const usePricesContract = () => {
  const [contract, setContract] = useState<Contract | undefined>()

  useEffect(() => {
    if (contract) return

    const load = async () => {
      try {
        const contract = await loadV1Contract(
          'Prices',
          readNetwork.name,
          readProvider,
        )

        setContract(contract)
      } catch (_) {
        // if Prices contract isn't deployed on the readNetwork,
        // fall back to mainnet
        const contract = await loadV1Contract(
          'Prices',
          NetworkName.mainnet,
          readProvider,
        )

        setContract(contract)
      }
    }

    load()
  }, [contract])

  return contract
}

export function useEtherPrice() {
  const contract = usePricesContract()

  const { refetchValue, value: price } = useContractReadValue({
    contract,
    functionName: 'getETHPriceFor',
    args: ['1'], // $1 USD
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
