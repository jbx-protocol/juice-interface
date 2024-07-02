import { Contract } from 'ethers'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { useJB721DelegateAbi } from 'packages/v2v3/hooks/JB721Delegate/contracts/useJB721DelegateAbi'
import { JB721DelegateVersion } from 'packages/v2v3/models/contracts'
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
