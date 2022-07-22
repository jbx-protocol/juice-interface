import { useErc20Contract } from 'hooks/Erc20Contract'
import { useEffect, useState } from 'react'

/** Returns name for ERC20 token with `address`. */
export default function useNameOfERC20(address: string | undefined) {
  const [data, setData] = useState<string>()

  const contract = useErc20Contract(address)

  useEffect(() => {
    async function fetchName() {
      if (!contract || !address) return

      const name = await contract.name()
      setData(name)
    }

    fetchName()
  }, [address, contract])

  return data
}
