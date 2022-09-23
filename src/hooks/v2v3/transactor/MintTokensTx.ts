import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
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
  const { contracts } = useContext(V2V3ContractsContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const { projectId, cv } = useContext(ProjectMetadataContext)

  // TODO new V2 feature:
  // Whether to use the current funding cycle's reserved rate in the mint calculation.
  const reservedRate = true

  return ({ value, beneficiary, preferClaimed, memo }, txOpts) => {
    try {
      invariant(transactor && projectId && contracts)
      return transactor(
        contracts?.JBController,
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
        : !contracts
        ? 'contracts'
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
