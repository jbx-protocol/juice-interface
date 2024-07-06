export type FeatureFlag = 'SIMULATE_TXS' | 'V4'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  V4: 'v4',
}
