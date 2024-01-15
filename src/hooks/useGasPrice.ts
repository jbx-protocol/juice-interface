import { BigNumber, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useWallet } from './Wallet'

const provider = new ethers.providers.JsonRpcProvider()

export const useGasPrice = () => {
  const [gasPriceWei, setGasPriceWei] = useState<BigNumber>(BigNumber.from(0))
  const { signer } = useWallet()

  const fetchGasPrice = useCallback(async () => {
    const gp = await (signer ?? provider).getGasPrice()
    setGasPriceWei(gp)
  }, [signer])

  const estimateGas = useCallback(
    async (tx: ethers.providers.TransactionRequest) => {
      const gasLimit = await (signer ?? provider).estimateGas(tx)
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
