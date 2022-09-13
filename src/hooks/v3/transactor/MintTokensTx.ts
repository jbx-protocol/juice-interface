import { BigNumber } from '@ethersproject/bignumber'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { V3UserContext } from 'contexts/v3/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export function useMintTokensTx(): TransactorInstance<{
  value: BigNumber
  beneficiary: string
  preferClaimed: boolean
  memo: string
}> {
  const { transactor, contracts } = useContext(V3UserContext)
  const { projectId } = useContext(V3ProjectContext)

  // TODO new V2 feature:
  // Whether to use the current funding cycle's reserved rate in the mint calculation.
  const reservedRate = true

  return ({ value, beneficiary, preferClaimed, memo }, txOpts) => {
    if (!transactor || !contracts || !projectId) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const contract = contracts.JBController
    const functionName = 'mintTokensOf'
    const args = [
      projectId,
      value.toHexString(),
      beneficiary,
      memo ?? '',
      preferClaimed,
      reservedRate,
    ]

    return transactor(contract, functionName, args, txOpts)
  }
}
