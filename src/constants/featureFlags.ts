export type FeatureFlag =
  | 'V1_TOKEN_SWAP'
  | 'SIMULATE_TXS'
  | 'SEPANA_SEARCH'
  | 'RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE'
  | 'ANNOUNCEMENTS'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  V1_TOKEN_SWAP: 'v1TokenSwap',
  SIMULATE_TXS: 'simulateTxs',
  SEPANA_SEARCH: 'sepanaSearch',
  RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE: 'reconfigureShowNftGovernanceType',
  ANNOUNCEMENTS: 'announcements',
}
