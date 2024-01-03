import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import { PaymentTerminalVersion, V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { useV2ProjectTitle } from '../../useProjectTitle'
import { getAddToBalanceArgsV3 } from './useAddToBalanceArgsV3'
import { getAddToBalanceArgsV3_1 } from './useAddToBalanceArgsV3_1'

/**
 * Factory function for building the arguments for the `addToBalance` function, depending on the version of the JBETHPaymentTerminal contract.
 */
function buildTxArgs({
  JBETHPaymentTerminalVersion,
  projectId,
  value,
}: {
  JBETHPaymentTerminalVersion: PaymentTerminalVersion | undefined
  projectId: number
  value: BigNumber
}) {
  if (JBETHPaymentTerminalVersion === V2V3ContractName.JBETHPaymentTerminal) {
    return getAddToBalanceArgsV3({ projectId, value })
  }
  if (
    JBETHPaymentTerminalVersion === V2V3ContractName.JBETHPaymentTerminal3_1 ||
    JBETHPaymentTerminalVersion ===
      V2V3ContractName.JBETHPaymentTerminal3_1_1 ||
    JBETHPaymentTerminalVersion === V2V3ContractName.JBETHPaymentTerminal3_1_2
  ) {
    return getAddToBalanceArgsV3_1({ projectId, value })
  }
}

export function useAddToBalanceTx(): TransactorInstance<{
  value: BigNumber
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts, versions } = useContext(V2V3ProjectContractsContext)
  const { cv } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  return ({ value }, txOpts) => {
    try {
      invariant(projectId && contracts?.JBETHPaymentTerminal)

      const txArgs = buildTxArgs({
        JBETHPaymentTerminalVersion: versions.JBETHPaymentTerminalVersion,
        projectId,
        value,
      })

      invariant(transactor && projectTitle && txArgs)

      return transactor(
        contracts.JBETHPaymentTerminal,
        txArgs?.functionName,
        txArgs?.args,
        {
          ...txOpts,
          value,
          title: t`Transfer ETH to ${projectTitle}`,
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
