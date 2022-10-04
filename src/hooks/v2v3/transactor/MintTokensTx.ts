import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/Transactor'
import invariant from 'tiny-invariant'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useMintTokensTx(): TransactorInstance<{
  value: BigNumber
  beneficiary: string
  preferClaimed: boolean
  memo: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const {
    contracts: { JBController },
  } = useContext(V2V3ProjectContractsContext)
  const { projectId, cv } = useContext(ProjectMetadataContext)

  // TODO new V2 feature:
  // Whether to use the current funding cycle's reserved rate in the mint calculation.
  const reservedRate = true

  return ({ value, beneficiary, preferClaimed, memo }, txOpts) => {
    try {
      invariant(transactor && projectId && JBController)
      return transactor(
        JBController,
        'mintTokensOf',
        [
          projectId,
          value.toHexString(),
          beneficiary,
          memo ?? '',
          preferClaimed,
          reservedRate,
        ],
        {
          ...txOpts,
          title: t`Mint ${tokenSymbolText({
            tokenSymbol,
            plural: true,
          })}`,
        },
      )
    } catch {
      const missingParam = !transactor
        ? 'transactor'
        : !JBController
        ? 'JBController'
        : !projectId
        ? 'projectId'
        : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'mintTokensOf',
        cv,
      })
    }
  }
}
