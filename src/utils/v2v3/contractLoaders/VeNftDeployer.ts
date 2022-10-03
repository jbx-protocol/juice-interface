import { FEATURE_FLAGS } from 'constants/featureFlags'
import { VENFT_DEPLOYER_ADDRESS } from 'constants/veNft/veNftProject'
import { featureFlagEnabled } from 'utils/featureFlags'

export const loadVeNftDeployer = async () => {
  if (!featureFlagEnabled(FEATURE_FLAGS.VENFT)) return

  const contractJson = {
    abi: (
      await import(
        `@jbx-protocol/ve-nft/out/JBVeNftDeployer.sol/JBVeNftDeployer.json`
      )
    ).abi,
    address: VENFT_DEPLOYER_ADDRESS,
    // TODO: replace when broadcast is updated
    // address: (
    //   (await import(
    //     `@jbx-protocol/ve-nft/broadcast/deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
    //   )) as ForgeDeploy
    // ).receipts[0].contractAddress,
  }

  return contractJson
}
