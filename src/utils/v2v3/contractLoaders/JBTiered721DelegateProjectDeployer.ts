import { JB721_DELEGATE_V1 } from 'constants/delegateVersions'
import { loadJB721DelegateJson } from 'hooks/JB721Delegate/contracts/JB721DelegateAbi'
import { ContractJson } from 'models/contracts'
import { findJBTiered721DelegateProjectDeployerAddress } from 'utils/nftRewards'

export const loadJBTiered721DelegateProjectDeployerContract = async () => {
  const JBTiered721DelegateProjectDeployerContractAddress =
    await findJBTiered721DelegateProjectDeployerAddress()
  if (!JBTiered721DelegateProjectDeployerContractAddress) return

  const nftDeployerContractJson = {
    address: JBTiered721DelegateProjectDeployerContractAddress,
    abi: (
      await loadJB721DelegateJson<ContractJson>(
        'out/IJBTiered721DelegateProjectDeployer.sol/IJBTiered721DelegateProjectDeployer.json',
        JB721_DELEGATE_V1,
      )
    )?.abi,
  }

  return nftDeployerContractJson
}
