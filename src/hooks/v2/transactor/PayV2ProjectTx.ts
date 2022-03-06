import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { BigNumber, ethers } from 'ethers'

import { TransactorInstance } from '../../Transactor'

export type PayV2ProjectTxType = TransactorInstance<{
  memo: string
  preferClaimedTokens: boolean
  beneficiary?: string
  value: BigNumber
}>

export function usePayV2ProjectTx(): PayV2ProjectTxType {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)
  const minReturnedTokens = 0 // TODO will need a field for this in V2ConfirmPayOwnerModal

  return ({ memo, preferClaimedTokens, beneficiary, value }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.JBETHPaymentTerminal ||
      !beneficiary
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts?.JBETHPaymentTerminal,
      'pay',
      [
        projectId,
        beneficiary,
        minReturnedTokens,
        preferClaimedTokens,
        memo || '',
        ethers.utils.randomBytes(1), //delegateMetadata
      ],
      {
        ...txOpts,
        value: value,
      },
    )
  }
}
