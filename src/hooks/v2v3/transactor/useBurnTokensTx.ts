import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useBurnTokensTx(): TransactorInstance<{
  burnAmount: BigNumber
  memo: string
  preferClaimedTokens?: boolean
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ProjectContractsContext)
  const { cv } = useContext(V2V3ContractsContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()

  return ({ burnAmount, memo, preferClaimedTokens = false }, txOpts) => {
    try {
      invariant(
        transactor && userAddress && projectId && contracts?.JBController,
      )
      return transactor(
        contracts?.JBController,
        'burnTokensOf',
        [
          userAddress, // _holder
          projectId, // _projectId
          burnAmount, // _tokenCount, tokens to burn
          memo, // _memo
          preferClaimedTokens, // _preferClaimedTokens
        ],
        {
          ...txOpts,
          title: t`Burn ${tokenSymbolText({
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
        : !contracts?.JBController
        ? 'contracts.JBController'
        : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'burnTokensOf',
        cv,
      })
    }
  }
}
