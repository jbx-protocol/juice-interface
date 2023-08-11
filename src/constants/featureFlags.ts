export type FeatureFlag =
  | 'SIMULATE_TXS'
  | 'NEW_PROJECT_PAGE'
  | 'NEW_CYCLE_CONFIG_PAGE'
  | 'NEW_EDIT_NFTS'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  NEW_PROJECT_PAGE: 'newProjectPage',
  NEW_CYCLE_CONFIG_PAGE: 'newCycleConfigPage',
  NEW_EDIT_NFTS: 'newEditNfts',
}
