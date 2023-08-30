import { Contract } from 'ethers'
import { useJB721DelegateAbi } from 'hooks/JB721Delegate/contracts/useJB721DelegateAbi'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { JB721DelegateVersion } from 'models/v2v3/contracts'
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
