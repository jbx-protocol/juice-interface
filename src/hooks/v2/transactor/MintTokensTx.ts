import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { handleTransactor } from 'utils/transactorHelper'

import { TransactorInstance } from '../../Transactor'

export function useMintTokensTx(): TransactorInstance<{
  value: BigNumber
  beneficiary: string
  preferClaimed: boolean
  memo: string
}> {
  const { transactor, contracts, version } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  // TODO new V2 feature:
  // Whether to use the current funding cycle's reserved rate in the mint calculation.
  const reservedRate = true

  return ({ value, beneficiary, preferClaimed, memo }, txOpts) => {
    return handleTransactor({
      args: [
        projectId,
        value.toHexString(),
        beneficiary,
        memo ?? '',
        preferClaimed,
        reservedRate,
      ],
      contract: contracts?.JBController,
      fnName: 'mintTokensOf',
      transactor,
      txOpts,
      version,
    })
  }
}
