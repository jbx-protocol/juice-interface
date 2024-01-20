import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { useProjectPrimaryEthTerminal } from '../V2V3ProjectContracts/projectContractLoaders/useProjectPrimaryEthTerminal'

export function useProcessHeldFeesTx(): TransactorInstance {
  const { transactor } = useContext(TransactionContext)
  const { cv } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)
  if (projectId === undefined) {
    throw new Error('projectId is undefined in useProcessHeldFeesTx')
  }
  const { JBETHPaymentTerminal } = useProjectPrimaryEthTerminal({ projectId })

  const { userAddress } = useWallet()

  return (_, txOpts) => {
    try {
      invariant(transactor && userAddress && projectId && JBETHPaymentTerminal)
      return transactor(JBETHPaymentTerminal, 'processFees', [projectId], {
        ...txOpts,
        title: t`Process project #${projectId}'s held fees`,
      })
    } catch {
      const missingParam = !projectId ? 'project' : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'processFees',
        cv,
      })
    }
  }
}
