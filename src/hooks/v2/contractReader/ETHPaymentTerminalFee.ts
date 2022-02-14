import { BigNumber } from '@ethersproject/bignumber'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext, useEffect, useState } from 'react'

export function useETHPaymentTerminalFee() {
  const [fee, setFee] = useState<BigNumber>()
  const { contracts } = useContext(V2UserContext)

  useEffect(() => {
    async function fetchData() {
      const res = await contracts?.JBETHPaymentTerminal.functions.fee()
      if (!res) return

      setFee(res[0])
    }
    fetchData()
  }, [contracts])

  return fee
}
