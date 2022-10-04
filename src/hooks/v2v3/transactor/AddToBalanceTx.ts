import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/Transactor'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { useV2ProjectTitle } from '../ProjectTitle'

const DEFAULT_METADATA = 0

export function useAddToBalanceTx(): TransactorInstance<{
  value: BigNumber
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ProjectContractsContext)
  const { projectId, cv } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  const DEFAULT_MEMO = ''

  return ({ value }, txOpts) => {
    try {
      invariant(
        transactor &&
          projectId &&
          projectTitle &&
          contracts?.JBETHPaymentTerminal,
      )
      return transactor(
        contracts.JBETHPaymentTerminal,
        'addToBalanceOf',
        [projectId, value, ETH_TOKEN_ADDRESS, DEFAULT_MEMO, DEFAULT_METADATA],
        {
          ...txOpts,
          value,
          title: t`Add to balance of ${projectTitle}`,
        },
      )
    } catch {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.JBETHPaymentTerminal
        ? 'contracts.JBETHPaymentTerminal'
        : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        cv,
        functionName: 'addToBalanceOf',
      })
    }
  }
}
