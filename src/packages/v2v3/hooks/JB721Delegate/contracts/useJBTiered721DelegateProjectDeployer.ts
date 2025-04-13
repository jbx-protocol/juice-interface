import { Contract } from '@ethersproject/contracts'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { JB721DelegateVersion } from 'models/JB721Delegate'
import { useJB721DelegateAbi } from 'packages/v2v3/hooks/JB721Delegate/contracts/useJB721DelegateAbi'
import { useJB721DelegateContractAddress } from './useJB721DelegateContractAddress'

export function useJBTiered721DelegateProjectDeployer({
  version,
}: {
  version: JB721DelegateVersion | undefined
}): Contract | undefined {
  const JBTiered721DelegateProjectDeployerJson = useJB721DelegateAbi(
    'IJBTiered721DelegateProjectDeployer',
    version,
  )

  const address = useJB721DelegateContractAddress({
    contractName: 'JBTiered721DelegateProjectDeployer',
    version,
  })

  return useLoadContractFromAddress({
    address,
    abi: JBTiered721DelegateProjectDeployerJson,
  })
}
