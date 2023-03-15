export type FeatureFlag =
  | 'V1_TOKEN_SWAP'
  | 'VENFT'
  | 'VENFT_CREATOR'
  | 'SIMULATE_TXS'
  | 'SEPANA_SEARCH'
  | 'DELEGATE_V1_1'
  | 'RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE'
  | 'JB_V3_1_UPGRADE'
  | 'BRAND_REFRESH_BANNER'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  V1_TOKEN_SWAP: 'v1TokenSwap',
  VENFT: 'veNft',
  VENFT_CREATOR: 'veNftCreator',
  SIMULATE_TXS: 'simulateTxs',
  SEPANA_SEARCH: 'sepanaSearch',
  DELEGATE_V1_1: 'delegate_v1_1',
  JB_V3_1_UPGRADE: 'jb_v3_1_upgrade',
  RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE: 'reconfigureShowNftGovernanceType',
  BRAND_REFRESH_BANNER: 'brandRefreshBanner',
}
