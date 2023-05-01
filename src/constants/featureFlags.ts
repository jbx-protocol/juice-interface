export type FeatureFlag =
  | 'SIMULATE_TXS'
  | 'RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE: 'reconfigureShowNftGovernanceType',
}
