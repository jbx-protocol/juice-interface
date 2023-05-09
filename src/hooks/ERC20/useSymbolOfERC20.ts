import { useErc20Contract } from 'hooks/ERC20/useErc20Contract'
import { useEffect, useState } from 'react'
import { isZeroAddress } from 'utils/address'

/** Returns symbol for ERC20 token with `address`. */
export default function useSymbolOfERC20(tokenAddress: string | undefined) {
  const [data, setData] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const contract = useErc20Contract(tokenAddress)

  useEffect(() => {
    async function fetchSymbol() {
      if (!contract || !tokenAddress || isZeroAddress(tokenAddress)) {
        setData(undefined)
        return
      }

      setLoading(true)
      try {
        const symbol = await contract.symbol()
        setData(symbol)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }

    fetchSymbol()
  }, [tokenAddress, contract])

  return { data, loading }
}
