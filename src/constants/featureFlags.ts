export type FeatureFlag =
  | 'SIMULATE_TXS'
  | 'NEW_PROJECT_PAGE'
  | 'PAYOUTS_TABLE_CREATE_FLOW'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  NEW_PROJECT_PAGE: 'newProjectPage',
  PAYOUTS_TABLE_CREATE_FLOW: 'payoutsTableCreateFlow',
}
