import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import { DEFAULT_MIN_RETURNED_TOKENS } from 'constants/transactionDefaults'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'
import { useV2ProjectTitle } from '../ProjectTitle'

const DEFAULT_DELEGATE_METADATA = 0

type PayV2ProjectTx = TransactorInstance<{
  erc20Terminal: Contract
  erc20Address: string
  memo: string
  preferClaimedTokens: boolean
  value: BigNumber
  beneficiary?: string
  delegateMetadata?: string
}>

export function usePayERC20PaymentTerminalTx(): PayV2ProjectTx {
  const { transactor } = useContext(TransactionContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  return (
    {
      erc20Terminal,
      erc20Address,
      memo,
      preferClaimedTokens,
      beneficiary,
      value,
      delegateMetadata,
    },
    txOpts,
  ) => {
    if (!transactor || !projectId || !erc20Terminal || !beneficiary) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      erc20Terminal,
      'pay',
      [
        projectId,
        value,
        erc20Address,
        beneficiary,
        DEFAULT_MIN_RETURNED_TOKENS, // minReturnedTokens
        preferClaimedTokens, // _preferClaimedTokens
        memo || '',
        delegateMetadata ?? DEFAULT_DELEGATE_METADATA, // _metadata
      ],
      {
        ...txOpts,
        title: t`Pay ${projectTitle} with token: ${erc20Address}`,
      },
    )
  }
}
