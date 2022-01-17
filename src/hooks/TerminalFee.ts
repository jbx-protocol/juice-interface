import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { UserContext } from 'contexts/userContext'
import { TerminalVersion } from 'models/terminal-version'
import { useContext, useEffect, useState } from 'react'

export function useTerminalFee(version?: TerminalVersion) {
  const [fee, setFee] = useState<BigNumber>()
  const { contracts } = useContext(UserContext)

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
