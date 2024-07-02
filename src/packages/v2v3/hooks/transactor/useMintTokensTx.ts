import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { toHexString } from 'utils/bigNumbers'
import { tokenSymbolText } from 'utils/tokenSymbolText'

const DEFAULT_USE_RESERVED_RATE = false

export function useMintTokensTx(): TransactorInstance<{
  value: bigint
  beneficiary: string
  preferClaimed: boolean
  memo: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const {
    contracts: { JBController },
  } = useContext(V2V3ProjectContractsContext)
  const { cv } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ value, beneficiary, preferClaimed, memo }, txOpts) => {
    try {
      invariant(transactor && projectId && JBController)
      return transactor(
        JBController,
        'mintTokensOf',
        [
          projectId,
          toHexString(value),
          beneficiary,
          memo ?? '',
          preferClaimed,
          DEFAULT_USE_RESERVED_RATE, // _useReservedRate
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
