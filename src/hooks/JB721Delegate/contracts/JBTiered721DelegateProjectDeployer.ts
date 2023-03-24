import { Contract } from '@ethersproject/contracts'
import { useJB721DelegateAbi } from 'hooks/JB721Delegate/contracts/JB721DelegateAbi'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useJB721DelegateContractAddress } from './JB721DelegateContractAddress'

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
