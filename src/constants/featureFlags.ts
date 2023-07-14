export type FeatureFlag =
  | 'SIMULATE_TXS'
  | 'NEW_CYCLE_CONFIG_PAGE'
  | 'RICH_PROJECT_DESCRIPTION'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  NEW_CYCLE_CONFIG_PAGE: 'newCycleConfigPage',
  RICH_PROJECT_DESCRIPTION: 'richProjectDescription',
}
