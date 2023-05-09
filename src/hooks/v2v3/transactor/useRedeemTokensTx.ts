import { t } from '@lingui/macro'
import { DEFAULT_METADATA } from 'constants/transactionDefaults'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useRedeemTokensTx(): TransactorInstance<{
  redeemAmount: BigNumber
  minReturnedTokens: BigNumber
  memo: string
  metadata?: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ProjectContractsContext)
  const { cv } = useContext(V2V3ContractsContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()

  return (
    { redeemAmount, minReturnedTokens, memo, metadata = DEFAULT_METADATA },
    txOpts,
  ) => {
    try {
      invariant(
        transactor &&
          userAddress &&
          projectId &&
          contracts?.JBETHPaymentTerminal,
      )
      return transactor(
        contracts?.JBETHPaymentTerminal,
        'redeemTokensOf',
        [
          userAddress, // _holder
          projectId, // _projectId
          redeemAmount, // _tokenCount, tokens to redeem
          constants.AddressZero, // _token, unused parameter
          minReturnedTokens, // _minReturnedTokens, min amount of ETH to receive
          userAddress, // _beneficiary
          memo, // _memo
          metadata, // _metadata
        ],
        {
          ...txOpts,
          title: t`Redeem ${tokenSymbolText({
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
        : !contracts?.JBETHPaymentTerminal
        ? 'contracts.JBETHPaymentTerminal'
        : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'redeemTokensOf',
        cv,
      })
    }
  }
}
