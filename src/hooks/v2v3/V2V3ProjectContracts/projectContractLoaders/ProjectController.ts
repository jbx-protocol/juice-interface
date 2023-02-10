import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import useProjectControllerAddress from '../../contractReader/ProjectControllerAddress'
import { useLoadV2V3Contract } from '../../LoadV2V3Contract'

export function useProjectController({ projectId }: { projectId: number }) {
  const { cv, contracts } = useContext(V2V3ContractsContext)

  const { data: controllerAddress, loading: JBControllerLoading } =
    useProjectControllerAddress({
      projectId,
    })

  const JBController = useLoadV2V3Contract({
    cv,
    contractName:
      controllerAddress === contracts?.JBController
        ? V2V3ContractName.JBController
        : controllerAddress === contracts?.JBController3_0_1
        ? V2V3ContractName.JBController3_0_1
        : undefined,
    address: controllerAddress,
  })

  return { JBController, loading: JBControllerLoading }
}
