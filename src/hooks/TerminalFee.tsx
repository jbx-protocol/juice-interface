import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Contracts } from 'models/contracts'
import { TerminalVersion } from 'models/terminal-version'
import { useEffect, useState } from 'react'

export function useTerminalFee(
  version?: TerminalVersion,
  contracts?: Contracts,
) {
  const [fee, setFee] = useState<BigNumber>()

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
