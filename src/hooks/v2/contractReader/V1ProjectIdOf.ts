import { BigNumberish, BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useEffect, useState } from 'react'
import JBV1TokenPaymentTerminal from '@jbx-protocol/juice-v1-token-terminal/out/JBV1TokenPaymentTerminal.sol/JBV1TokenPaymentTerminal.json'

import { JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS } from 'constants/contracts'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'
import { ContractReadResult } from './V2ContractReader'

export function useV1ProjectIdOf(
  projectId: BigNumberish | undefined,
): ContractReadResult<BigNumber | undefined> {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<BigNumber>()

  useEffect(() => {
    const contractAddress =
      JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS[readNetwork.name]

    if (!contractAddress || !projectId) return

    const v1TokenPaymentTerminalContract = new Contract(
      contractAddress,
      JBV1TokenPaymentTerminal.abi,
      readProvider,
    )

    async function load() {
      setLoading(true)

      const data = await v1TokenPaymentTerminalContract.v1ProjectIdOf(projectId)

      setData(data)
      setLoading(false)
    }
    load()
  }, [projectId])

  return { data, loading }
}
