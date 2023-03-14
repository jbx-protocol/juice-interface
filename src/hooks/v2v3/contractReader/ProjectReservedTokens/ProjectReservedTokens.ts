import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import {
  JB_CONTROLLER_V_3,
  JB_CONTROLLER_V_3_0_1,
  JB_CONTROLLER_V_3_1,
} from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectController'
import { useContext, useMemo } from 'react'
import useContractReader from '../V2ContractReader'
import { useProjectReservedTokensArgsV3 } from './ProjectReservedTokensArgsV3'
import { useProjectReservedTokensArgsV3_1 } from './ProjectReservedTokensArgsV3_1'

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
    if (
      versions.JBControllerVersion === JB_CONTROLLER_V_3 ||
      versions.JBControllerVersion === JB_CONTROLLER_V_3_0_1
    ) {
      return JBControllerArgsV3_0
    }

    if (versions.JBControllerVersion === JB_CONTROLLER_V_3_1) {
      return JBControllerArgsV3_1
    }

    return { contract: undefined, functionName: undefined, args: undefined }
  }, [JBControllerArgsV3_0, JBControllerArgsV3_1, versions.JBControllerVersion])

  return useContractReader<BigNumber>(args)
}
