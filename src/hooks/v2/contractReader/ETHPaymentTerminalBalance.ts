import { BigNumber } from '@ethersproject/bignumber'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext, useEffect, useState } from 'react'

export function useETHPaymentTerminalBalance({
  projectId,
}: {
  projectId?: BigNumber
}) {
  const [balance, setBalance] = useState<BigNumber>()
  const [loading, setLoading] = useState<boolean>(false)

  const { contracts } = useContext(V2UserContext)

  useEffect(() => {
    setLoading(true)
    async function fetchData() {
      if (!projectId) return
      const res =
        await contracts?.JBETHPaymentTerminalStore.functions.balanceOf(
          projectId,
        )
      if (!res) return
      setBalance(res[0])
      setLoading(false)
    }
    fetchData()
  }, [contracts, projectId])

  return { data: balance, loading }
}
