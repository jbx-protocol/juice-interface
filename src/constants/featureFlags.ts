export type FeatureFlag = 'SIMULATE_TXS' | 'PAYOUTS_TABLE_CREATE_FLOW'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  PAYOUTS_TABLE_CREATE_FLOW: 'payoutsTableCreateFlow',
}
