export type FeatureFlag =
  | 'SIMULATE_TXS'
  | 'NEW_PROJECT_PAGE'
  | 'NEW_CYCLE_CONFIG_PAGE'
  | 'RICH_PROJECT_DESCRIPTION'
  | 'PROJECT_UPDATES'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  NEW_PROJECT_PAGE: 'newProjectPage',
  NEW_CYCLE_CONFIG_PAGE: 'newCycleConfigPage',
  RICH_PROJECT_DESCRIPTION: 'richProjectDescription',
  PROJECT_UPDATES: 'projectUpdates',
}
