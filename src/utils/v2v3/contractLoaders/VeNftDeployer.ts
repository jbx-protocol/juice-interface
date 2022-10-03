import { VENFT_DEPLOYER_ADDRESS } from 'constants/veNft/veNftProject'

export const loadVeNftDeployer = async () => {
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
