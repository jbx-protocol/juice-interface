import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext, useEffect, useState } from 'react'

export function useETHPaymentTerminalFee() {
  const [fee, setFee] = useState<BigNumber>()
  const { contracts } = useContext(V2V3ContractsContext)

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
