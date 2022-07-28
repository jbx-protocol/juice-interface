import { useErc20Contract } from 'hooks/Erc20Contract'
import { useEffect, useState } from 'react'
import * as constants from '@ethersproject/constants'

/** Returns symbol for ERC20 token with `address`. */
export default function useSymbolOfERC20(tokenAddress: string | undefined) {
  const [data, setData] = useState<string>()

  const contract = useErc20Contract(tokenAddress)

  useEffect(() => {
    async function fetchSymbol() {
      if (
        !contract ||
        !tokenAddress ||
        tokenAddress === constants.AddressZero
      ) {
        setData(undefined)
        return
      }

      const symbol = await contract.symbol()
      setData(symbol)
    }

    fetchSymbol()
  }, [tokenAddress, contract])

  return data
}
