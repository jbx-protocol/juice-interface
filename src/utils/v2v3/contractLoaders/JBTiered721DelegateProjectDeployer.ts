import { getLatestNftProjectDeployerContractAddress } from 'utils/nftRewards'

export const loadJBTiered721DelegateProjectDeployerContract = async () => {
  const JBTiered721DelegateProjectDeployerContractAddress =
    await getLatestNftProjectDeployerContractAddress()

  const nftDeployerContractJson = {
    address: JBTiered721DelegateProjectDeployerContractAddress,
    abi: (
      await import(
        `@jbx-protocol/juice-nft-rewards/out/IJBTiered721DelegateProjectDeployer.sol/IJBTiered721DelegateProjectDeployer.json`
      )
    ).abi,
  }

  return nftDeployerContractJson
}
