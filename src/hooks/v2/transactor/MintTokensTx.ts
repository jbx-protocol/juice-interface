import { BigNumber } from '@ethersproject/bignumber'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useMintTokensTx(): TransactorInstance<{
  value: BigNumber
  beneficiary: string
  preferClaimed: boolean
  memo: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  // TODO new V2 feature:
  // Whether to use the current funding cycle's reserved rate in the mint calculation.
  const reservedRate = true

  return ({ value, beneficiary, preferClaimed, memo }, txOpts) => {
    if (!transactor || !contracts || !projectId) {
      const missingParam = !transactor
        ? 'transactor'
        : !contracts
        ? 'contracts'
        : !projectId
        ? 'projectId'
        : null

      txOpts?.onError?.(
        new DOMException(
          `Missing ${missingParam ?? 'parameter not found'} in v2 transactor`,
        ),
      )

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
