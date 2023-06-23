export type FeatureFlag = 'SIMULATE_TXS' | 'NEW_PROJECT_PAGE'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  NEW_PROJECT_PAGE: 'newProjectPage',
}
