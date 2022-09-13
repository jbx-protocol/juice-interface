import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { V1UserContext } from 'contexts/v1/userContext'
import { V1TerminalVersion } from 'models/v1/terminals'
import { useContext, useEffect, useState } from 'react'

export function useTerminalFee(version?: V1TerminalVersion) {
  const [fee, setFee] = useState<BigNumber>()
  const { contracts } = useContext(V1UserContext)

  useEffect(() => {
    async function fetchData() {
      if (!version || !contracts) return

      let terminalContract: Contract | undefined = undefined

      switch (version) {
        case '1':
          terminalContract = contracts?.TerminalV1
          break
        case '1.1':
          terminalContract = contracts?.TerminalV1_1
          break
      }

      if (!terminalContract) return

      const res = await terminalContract?.functions.fee()

      if (res) setFee(res[0])
    }
    fetchData()
  }, [version, contracts])

  return fee
}
