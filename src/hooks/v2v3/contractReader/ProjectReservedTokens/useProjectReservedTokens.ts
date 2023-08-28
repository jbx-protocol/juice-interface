import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext, useMemo } from 'react'
import useContractReader from '../useV2ContractReader'
import { useProjectReservedTokensArgsV3 } from './useProjectReservedTokensArgsV3'
import { useProjectReservedTokensArgsV3_1 } from './useProjectReservedTokensArgsV3_1'

export function useProjectReservedTokens({
  projectId,
  reservedRate,
}: {
  projectId: number | undefined
  reservedRate: BigNumber | undefined
}) {
  const { versions } = useContext(V2V3ProjectContractsContext)

  const JBControllerArgsV3_0 = useProjectReservedTokensArgsV3({
    projectId,
    reservedRate,
  })
  const JBControllerArgsV3_1 = useProjectReservedTokensArgsV3_1({ projectId })

  const args = useMemo(() => {
    if (versions.JBControllerVersion === V2V3ContractName.JBController) {
      return JBControllerArgsV3_0
    }

    if (versions.JBControllerVersion === V2V3ContractName.JBController3_1) {
      return JBControllerArgsV3_1
    }

    return { contract: undefined, functionName: undefined, args: undefined }
  }, [JBControllerArgsV3_0, JBControllerArgsV3_1, versions.JBControllerVersion])

  return useContractReader<BigNumber>(args)
}
