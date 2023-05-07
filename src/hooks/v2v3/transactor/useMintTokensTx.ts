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
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { tokenSymbolText } from 'utils/tokenSymbolText'

const DEFAULT_USE_RESERVED_RATE = false

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
          value.toHexString(),
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
