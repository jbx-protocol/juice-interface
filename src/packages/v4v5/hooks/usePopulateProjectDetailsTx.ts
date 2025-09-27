import { jbControllerAbi } from 'juice-sdk-core'
import { useJBContractContext } from 'juice-sdk-react'
import { useCallback } from 'react'
import { encodeFunctionData } from 'viem'

/**
 * Hook to prepare the transaction data for editing project details (setting metadata URI)
 */
export function usePopulateProjectDetailsTx() {
  const { contracts, projectId } = useJBContractContext()

  const populateTransaction = useCallback(
    async (cid: `0x${string}`) => {
      if (!contracts.controller.data) {
        throw new Error('Controller contract address is required')
      }
      if (!projectId) {
        throw new Error('Project ID is required')
      }

      const data = encodeFunctionData({
        abi: jbControllerAbi,
        functionName: 'setUriOf',
        args: [projectId, cid],
      })

      return {
        to: contracts.controller.data,
        data,
        value: '0',
      }
    },
    [contracts.controller.data, projectId],
  )

  return { populateTransaction }
}
