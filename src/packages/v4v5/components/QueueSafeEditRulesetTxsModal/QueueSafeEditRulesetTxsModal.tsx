import { Trans } from '@lingui/macro'
import { JBChainId } from 'juice-sdk-core'
import { useCallback } from 'react'
import { SafeProposeTransactionResponse, useProposeSafeTransaction } from '../../hooks/useProposeSafeTransaction'
import { EditCycleFormFields } from '../../views/V4V5ProjectSettings/EditCyclePage/EditCycleFormFields'
import QueueSafeTxsModal from '../QueueSafeTxsModal'
import { useJBContractContext, useSuckers } from 'juice-sdk-react'
import { useContext } from 'react'
import { JBRulesetContext } from 'juice-sdk-react'
import { useV4V5Version } from '../../contexts/V4V5VersionProvider'
import { NATIVE_TOKEN, jbContractAddress, JBCoreContracts, jbController4_1Abi, jbControllerAbi } from 'juice-sdk-core'
import { transformEditCycleFormFieldsToTxArgs } from '../../utils/editRuleset'
import { encodeFunctionData } from 'viem'

export interface QueueSafeEditRulesetTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  safeAddress: string
  formValues: EditCycleFormFields
  onTxComplete?: (chainId: JBChainId, result: SafeProposeTransactionResponse) => void
}

export default function QueueSafeEditRulesetTxsModal({
  open,
  onCancel,
  safeAddress,
  formValues,
  onTxComplete,
}: QueueSafeEditRulesetTxsModalProps) {
  const { contracts, projectId } = useJBContractContext()
  const { data: suckers } = useSuckers()
  const { rulesetMetadata } = useContext(JBRulesetContext)
  const { version } = useV4V5Version()
  const { proposeTransaction } = useProposeSafeTransaction({ safeAddress })

  const handleExecuteChain = useCallback(
    async (chainId: JBChainId, signer?: string): Promise<SafeProposeTransactionResponse> => {
      if (
        !contracts.controller.data ||
        !contracts.primaryNativeTerminal.data
      ) {
        throw new Error('Contracts not ready')
      }

      // Find the project ID for this specific chain
      const sucker = suckers?.find(s => s.peerChainId === chainId)
      if (!sucker) {
        throw new Error(`No project found for chain ${chainId}`)
      }

      const chainProjectId = BigInt(sucker.projectId)

      // Transform form values to transaction arguments
      const args = transformEditCycleFormFieldsToTxArgs({
        formValues,
        primaryNativeTerminal: contracts.primaryNativeTerminal.data as `0x${string}`,
        tokenAddress: NATIVE_TOKEN as `0x${string}`,
        dataHook: (rulesetMetadata.data?.dataHook ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
        projectId: chainProjectId,
        chainId,
        version,
      })

      // Determine which ABI to use based on controller version
      const projectControllerAddress = contracts.controller.data
      let data: `0x${string}`

      if (version === 4 && projectControllerAddress === jbContractAddress['4'][JBCoreContracts.JBController4_1][chainId]) {
        // Use v4.1 controller ABI
        data = encodeFunctionData({
          abi: jbController4_1Abi,
          functionName: 'queueRulesetsOf',
          args,
        })
      } else {
        // Use v4 controller ABI
        data = encodeFunctionData({
          abi: jbControllerAbi,
          functionName: 'queueRulesetsOf',
          args,
        })
      }

      // Propose the transaction to the Safe, passing signer override
      return await proposeTransaction({
        to: contracts.controller.data,
        value: '0',
        data,
        chainId,
        signerAddressOverride: signer,
      })
    },
    [proposeTransaction, formValues, contracts, suckers, rulesetMetadata, version],
  )

  return (
    <QueueSafeTxsModal
      open={open}
      onCancel={onCancel}
      title={<Trans>Queue Safe Ruleset Transactions</Trans>}
      description={
        <Trans>
          Since your project owned by a Safe wallet, you need to queue separate transactions on each chain.
        </Trans>
      }
      onExecuteChain={handleExecuteChain}
      safeAddress={safeAddress}
      onTxComplete={onTxComplete}
      buttonTextOverride={{
        execute: (chainName: string) => <Trans>Queue on {chainName}</Trans>,
      }}
    />
  )
}
