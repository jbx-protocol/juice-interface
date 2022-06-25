import { useErc20Contract } from 'hooks/Erc20Contract'
import { useEffect, useState } from 'react'

/** Returns symbol for ERC20 token with `address`. */
export default function useSymbolOfERC20(address: string | undefined) {
  const [data, setData] = useState<string>()

  const contract = useErc20Contract(address)

  useEffect(() => {
    async function fetchSymbol() {
      if (!contract || !address) return

      const symbol = await contract.symbol()
      setData(symbol)
    }

    fetchSymbol()
  }, [address, contract])

  return data
}
