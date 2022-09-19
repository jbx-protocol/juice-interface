import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useContext } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { t } from '@lingui/macro'
import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useV2ProjectTitle } from '../ProjectTitle'

const DEFAULT_DELEGATE_METADATA = 0
const DEFAULT_MIN_RETURNED_TOKENS = 0 // TODO will need a field for this in V2ConfirmPayOwnerModal

type PayV2ProjectTx = TransactorInstance<{
  memo: string
  preferClaimedTokens: boolean
  beneficiary?: string
  value: BigNumber
}>

export function usePayETHPaymentTerminalTx(): PayV2ProjectTx {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

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
      contracts.JBETHPaymentTerminal,
      'pay',
      [
        projectId,
        value,
        ETH_TOKEN_ADDRESS,
        beneficiary,
        DEFAULT_MIN_RETURNED_TOKENS, // minReturnedTokens
        preferClaimedTokens, // _preferClaimedTokens
        memo || '',
        DEFAULT_DELEGATE_METADATA, //delegateMetadata
      ],
      {
        ...txOpts,
        value,
        title: t`Pay ${projectTitle}`,
      },
    )
  }
}
