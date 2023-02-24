type FeatureFlag =
  | 'V1_TOKEN_SWAP'
  | 'VENFT'
  | 'VENFT_CREATOR'
  | 'SIMULATE_TXS'
  | 'SEPANA_SEARCH'
  | 'DELEGATE_V1_1'
  | 'RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  V1_TOKEN_SWAP: 'v1TokenSwap',
  VENFT: 'veNft',
  VENFT_CREATOR: 'veNftCreator',
  SIMULATE_TXS: 'simulateTxs',
  SEPANA_SEARCH: 'sepanaSearch',
  DELEGATE_V1_1: 'delegate_v1_1',
  RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE: 'reconfigureShowNftGovernanceType',
}
