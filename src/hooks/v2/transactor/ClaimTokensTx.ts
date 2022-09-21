import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useClaimTokensTx(): TransactorInstance<{
  claimAmount: BigNumber
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const { tokenSymbol } = useContext(V2ProjectContext)
  const { projectId, cv } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()

  return ({ claimAmount }, txOpts) => {
    try {
      invariant(
        transactor && userAddress && projectId && contracts?.JBTokenStore,
      )
      return transactor(
        contracts?.JBTokenStore,
        'claimFor',
        [userAddress, projectId, claimAmount.toHexString()],
        {
          ...txOpts,
          title: t`Claim ${tokenSymbolText({
            tokenSymbol,
            plural: true,
          })}`,
        },
      )
    } catch {
      const missingParam = !transactor
        ? 'transactor'
        : !userAddress
        ? 'userAddress'
        : !projectId
        ? 'projectId'
        : !contracts?.JBTokenStore
        ? 'contracts.JBTokenStore'
        : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'claimFor',
        cv,
      })
    }
  }
}
