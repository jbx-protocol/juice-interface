import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import {
  JB_CONTROLLER_V_3,
  JB_CONTROLLER_V_3_0_1,
  JB_CONTROLLER_V_3_1,
} from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectController'
import { useContext, useMemo } from 'react'
import useContractReader from '../V2ContractReader'
import { useProjectReservedTokensParamsV3 } from './ProjectReservedTokensParamsV3'
import { useProjectReservedTokensParamsV3_1 } from './ProjectReservedTokensParamsV3_1'

export function useProjectReservedTokens({
  projectId,
  reservedRate,
}: {
  projectId: number | undefined
  reservedRate: BigNumber | undefined
}) {
  const { versions } = useContext(V2V3ProjectContractsContext)

  const JBControllerArgsV3_0 = useProjectReservedTokensParamsV3({
    projectId,
    reservedRate,
  })
  const JBControllerArgsV3_1 = useProjectReservedTokensParamsV3_1({ projectId })

  const args = useMemo(() => {
    if (
      versions.JBController === JB_CONTROLLER_V_3 ||
      versions.JBController === JB_CONTROLLER_V_3_0_1
    ) {
      return JBControllerArgsV3_0
    }

    if (versions.JBController === JB_CONTROLLER_V_3_1) {
      return JBControllerArgsV3_1
    }

    return { contract: undefined, functionName: undefined, args: undefined }
  }, [JBControllerArgsV3_0, JBControllerArgsV3_1, versions.JBController])

  return useContractReader<BigNumber>(args)
}
