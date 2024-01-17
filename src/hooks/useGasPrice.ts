import { readProvider } from 'constants/readProvider'
import { BigNumber, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useWallet } from './Wallet'

export const useGasPrice = () => {
  const [gasPriceWei, setGasPriceWei] = useState<BigNumber>(BigNumber.from(0))
  const { signer } = useWallet()

  const fetchGasPrice = useCallback(async () => {
    const gp = await (signer ?? readProvider).getGasPrice()
    setGasPriceWei(gp)
  }, [signer])

  const estimateGas = useCallback(
    async (tx: ethers.providers.TransactionRequest) => {
      const gasLimit = await (signer ?? readProvider).estimateGas(tx)
      return gasLimit
    },
    [signer],
  )

  useEffect(() => {
    fetchGasPrice()
    const timer = setInterval(fetchGasPrice, 10000)
    return () => clearInterval(timer)
  }, [fetchGasPrice])

  return { gasPriceWei, estimateGas }
}
