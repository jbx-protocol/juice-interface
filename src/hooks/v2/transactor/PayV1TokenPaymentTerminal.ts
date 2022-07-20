import { useContext } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import * as constants from '@ethersproject/constants'

import { TransactorInstance } from '../../Transactor'

const DEFAULT_DELEGATE_METADATA = 0
const DEFAULT_MIN_RETURNED_TOKENS = 0

type PayV2ProjectTx = TransactorInstance<{
  memo: string
  preferClaimedTokens: boolean
  beneficiary?: string
  value: BigNumber
}>

export function usePayV1TokenPaymentTerminal(): PayV2ProjectTx {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ memo, preferClaimedTokens, beneficiary, value }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !beneficiary ||
      !contracts?.JBV1TokenPaymentTerminal
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBV1TokenPaymentTerminal,
      'pay',
      [
        projectId,
        value,
        constants.AddressZero,
        beneficiary,
        DEFAULT_MIN_RETURNED_TOKENS,
        preferClaimedTokens,
        memo || '',
        DEFAULT_DELEGATE_METADATA, //delegateMetadata
      ],
      {
        ...txOpts,
      },
    )
  }
}
