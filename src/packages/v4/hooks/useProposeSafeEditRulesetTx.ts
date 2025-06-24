import { JBChainId, NATIVE_TOKEN, jbProjectDeploymentAddresses } from 'juice-sdk-core'
import {
    jbController4_1Abi,
    jbControllerAbi,
    useJBContractContext,
    useSuckers
} from 'juice-sdk-react'
import { SafeProposeTransactionResponse, useProposeSafeTransaction } from './useProposeSafeTransaction'

import { useCallback } from 'react'
import { encodeFunctionData } from 'viem'
import { transformEditCycleFormFieldsToTxArgs } from '../utils/editRuleset'
import { EditCycleFormFields } from '../views/V4ProjectSettings/EditCyclePage/EditCycleFormFields'

export interface ProposeSafeEditRulesetTxProps {
  safeAddress: string
  formValues: EditCycleFormFields
}

export function useProposeSafeEditRulesetTx({ safeAddress }: { safeAddress: string }) {
  const { contracts, projectId } = useJBContractContext()
  const { proposeTransaction } = useProposeSafeTransaction({ safeAddress })
  const { data: suckers } = useSuckers()

  const proposeEditRulesetTx = useCallback(
    async (
      chainId: JBChainId,
      formValues: EditCycleFormFields,
    ): Promise<SafeProposeTransactionResponse> => {
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
        primaryNativeTerminal: contracts.primaryNativeTerminal.data,
        tokenAddress: NATIVE_TOKEN,
        projectId: chainProjectId,
      })

      // Determine which ABI to use based on controller version
      const projectControllerAddress = contracts.controller.data
      let data: `0x${string}`

      if (projectControllerAddress === jbProjectDeploymentAddresses.JBController4_1[1]) {
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

      // Propose the transaction to the Safe
      return await proposeTransaction({
        to: contracts.controller.data,
        value: '0',
        data,
        chainId,
      })
    },
    [
      contracts.controller.data,
      contracts.primaryNativeTerminal.data,
      proposeTransaction,
      suckers,
    ],
  )

  return { proposeEditRulesetTx }
}
