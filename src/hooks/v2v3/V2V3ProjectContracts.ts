import { Contract } from '@ethersproject/contracts'
import { readProvider } from 'constants/readProvider'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext } from 'react'
import useProjectController from './contractReader/ProjectController'

/**
 * Load project-specific JB contracts.
 * @returns
 */
export function useV2V3ProjectContracts({ projectId }: { projectId: number }) {
  const { contracts } = useContext(V2V3ContractsContext)

  /**
   * Load controller data
   */
  const { data: controllerAddress } = useProjectController({
    projectId,
  })

  const JBController =
    controllerAddress && contracts
      ? new Contract(
          controllerAddress,
          contracts.JBController.interface,
          readProvider,
        )
      : undefined

  return {
    JBController,
  }
}
