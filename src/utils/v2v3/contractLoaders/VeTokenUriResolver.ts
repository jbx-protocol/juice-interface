import { VENFT_RESOLVER_ADDRESS } from 'constants/veNft/veNftProject'

export const loadVeTokenUriResolver = async () => {
  const contractJson = {
    abi: (
      await import(
        `@jbx-protocol/ve-nft/out/JBVeTokenUriResolver.sol/JBVeTokenUriResolver.json`
      )
    ).abi,
    address: VENFT_RESOLVER_ADDRESS,
    // TODO: replace when broadcast is updated
    // address: (
    //   (await import(
    //     `@jbx-protocol/ve-nft/broadcast/deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
    //   )) as ForgeDeploy
    // ).receipts[1].contractAddress,
  }

  return contractJson
}
