import { readNetwork } from 'constants/networks'
import { Contract } from '@ethersproject/contracts'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import DefaultTokenUriResolverJson from './DefaultTokenUriResolver.json'

// async function loadDefaultTokenUriResolverDeployment(network: NetworkName) {
//   const deployment = (await import (
//     `juice-token-resolver/broadcast/${network.charAt(0).toUpperCase() + network.substring(1)}_Deploy_DefaultResolverOnly.s.sol/${readNetwork.chainId}/run-latest.json`
//   )) as ForgeDeploy
//
//   return deployment
// }

export function useDefaultTokenUriResolver(): Contract | undefined {
  return useLoadContractFromAddress({
    address:
      readNetwork.chainId == 1
        ? '0x9D63AFc505C6b2c9387ad837A1Acf23e1e4fa520'
        : '0x9d7a1a7296fd2debd5fd9f48c15830d0aac3c092',
    abi: DefaultTokenUriResolverJson.abi,
  })
}
