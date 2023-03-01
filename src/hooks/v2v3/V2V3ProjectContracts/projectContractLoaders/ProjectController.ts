import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
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
    contractName: isEqualAddress(
      controllerAddress,
      contracts?.JBController?.address,
    )
      ? V2V3ContractName.JBController
      : isEqualAddress(controllerAddress, contracts?.JBController3_0_1?.address)
      ? V2V3ContractName.JBController3_0_1
      : isEqualAddress(controllerAddress, contracts?.JBController3_1?.address)
      ? V2V3ContractName.JBController3_1
      : undefined,
    address: controllerAddress,
  })

  return { JBController, loading: JBControllerLoading }
}
