export type FeatureFlag =
  | 'V1_TOKEN_SWAP'
  | 'SIMULATE_TXS'
  | 'RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  V1_TOKEN_SWAP: 'v1TokenSwap',
  SIMULATE_TXS: 'simulateTxs',
  RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE: 'reconfigureShowNftGovernanceType',
}
