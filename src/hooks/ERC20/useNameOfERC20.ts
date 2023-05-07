import { useErc20Contract } from 'hooks/ERC20/useErc20Contract'
import { useEffect, useState } from 'react'
import { isZeroAddress } from 'utils/address'

/** Returns name for ERC20 token with `address`. */
export default function useNameOfERC20(tokenAddress: string | undefined) {
  const [data, setData] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const contract = useErc20Contract(tokenAddress)

  useEffect(() => {
    async function fetchName() {
      if (!contract || !tokenAddress || isZeroAddress(tokenAddress)) {
        setData(undefined)
        return
      }

      setLoading(true)
      try {
        const name = await contract.name()
        setData(name)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }

    fetchName()
  }, [tokenAddress, contract])

  return { data, loading }
}
