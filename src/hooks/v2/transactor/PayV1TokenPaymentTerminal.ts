import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'

import * as constants from '@ethersproject/constants'
import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'

import { useV2ProjectTitle } from '../ProjectTitle'

const DEFAULT_DELEGATE_METADATA = 0
const DEFAULT_MIN_RETURNED_TOKENS = 0

type PayV2ProjectTx = TransactorInstance<{
  memo: string
  preferClaimedTokens: boolean
  beneficiary?: string
  value: BigNumber
}>

export function usePayV1TokenPaymentTerminal(): PayV2ProjectTx {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

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
        title: t`Swap v1 project tokens ${projectTitle}`,
      },
    )
  }
}
