import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useContext, useMemo } from 'react'
import { useIsJBControllerV3_0 } from '../JBController/IsJBControllerV3_0'
import { useIsJBControllerV3_0_1 } from '../JBController/IsJBControllerV3_0_1'
import { useIsJBControllerV3_1 } from '../JBController/IsJBControllerV3_1'
import useContractReader from './V2ContractReader'

export default function useProjectReservedTokens({
  projectId,
  reservedRate,
}: {
  projectId: number | undefined
  reservedRate: BigNumber | undefined
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  const isJBControllerV3_0 = useIsJBControllerV3_0({
    controllerAddress: contracts?.JBController?.address,
  })
  const isJBControllerV3_0_1 = useIsJBControllerV3_0_1({
    controllerAddress: contracts?.JBController?.address,
  })
  const isJBControllerV3_1 = useIsJBControllerV3_1({
    controllerAddress: contracts?.JBController?.address,
  })

  const JBControllerArgsV3_0 = useMemo(() => {
    return {
      contract: contracts.JBController,
      functionName: 'reservedTokenBalanceOf(uint256,uint256)',
      args: projectId && reservedRate ? [projectId, reservedRate] : null,
    }
  }, [contracts, projectId, reservedRate])
  const JBControllerArgsV3_1 = useMemo(() => {
    return {
      contract: contracts.JBController,
      functionName: 'reservedTokenBalanceOf(uint256)',
      args: projectId ? [projectId] : null, // JBControllerV3_1 doesn't need reservedRate
    }
  }, [contracts, projectId])

  const args = useMemo(() => {
    if (isJBControllerV3_0 || isJBControllerV3_0_1) return JBControllerArgsV3_0
    if (isJBControllerV3_1) return JBControllerArgsV3_1

    return { contract: undefined, functionName: undefined, args: undefined }
  }, [
    isJBControllerV3_0,
    isJBControllerV3_0_1,
    JBControllerArgsV3_0,
    isJBControllerV3_1,
    JBControllerArgsV3_1,
  ])

  return useContractReader<BigNumber>(args)
}
