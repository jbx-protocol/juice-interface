import { FEATURE_FLAGS } from 'constants/featureFlags'
import { NETWORKS_BY_NAME } from 'constants/networks'
import { NetworkName } from 'models/network-name'
import { featureFlagEnabled } from 'utils/featureFlags'
import { ForgeDeploy } from '../loadV2V3Contract'

export const loadJBV1TokenPaymentTerminalContract = async (
  network: NetworkName,
) => {
  if (!featureFlagEnabled(FEATURE_FLAGS.V1_TOKEN_SWAP)) return

  const contractJson = {
    abi: (
      await import(
        `@jbx-protocol/juice-v1-token-terminal/out/JBV1TokenPaymentTerminal.sol/JBV1TokenPaymentTerminal.json`
      )
    ).abi,
    address: (
      (await import(
        `@jbx-protocol/juice-v1-token-terminal/broadcast/Deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
      )) as ForgeDeploy
    ).receipts[0].contractAddress,
  }

  return contractJson
}
