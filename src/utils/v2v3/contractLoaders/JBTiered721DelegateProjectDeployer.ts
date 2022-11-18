import { findJBTiered721DelegateProjectDeployerAddress } from 'utils/nftRewards'

export const loadJBTiered721DelegateProjectDeployerContract = async () => {
  const JBTiered721DelegateProjectDeployerContractAddress =
    await findJBTiered721DelegateProjectDeployerAddress()
  if (!JBTiered721DelegateProjectDeployerContractAddress) return

  const nftDeployerContractJson = {
    address: JBTiered721DelegateProjectDeployerContractAddress,
    abi: (
      await import(
        `@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateProjectDeployer.sol/IJBTiered721DelegateProjectDeployer.json`
      )
    ).abi,
  }

  return nftDeployerContractJson
}
