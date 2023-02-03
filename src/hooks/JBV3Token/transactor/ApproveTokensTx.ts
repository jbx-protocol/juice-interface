import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { BigNumber } from '@ethersproject/bignumber'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { useJBV3Token } from '../contracts/JBV3Token'

export function useApproveTokensTx(): TransactorInstance<{
  amountWad: BigNumber
}> {
  const { transactor } = useContext(TransactionContext)
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { cv } = useContext(V2V3ContractsContext)

  const { userAddress } = useWallet()
  const tokenContract = useJBV3Token({ tokenAddress })

  return ({ amountWad }, txOpts) => {
    try {
      invariant(transactor && userAddress && projectId && tokenContract)
      return transactor(
        tokenContract,
        'approve(uint256,address,uint256)',
        [projectId, userAddress, amountWad],
        {
          ...txOpts,
          title: t`Approve tokens for migration to V3`,
        },
      )
    } catch {
      return handleTransactionException({
        txOpts,
        missingParam: '',
        functionName: 'approve',
        cv,
      })
    }
  }
}
