import { FEATURE_FLAGS } from 'constants/featureFlags'
import { featureFlagEnabled } from 'utils/featureFlags'
import { getLatestNftProjectDeployerContractAddress } from 'utils/nftRewards'

export const loadJBTiered721DelegateProjectDeployerContract = async () => {
  if (!featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)) return

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
