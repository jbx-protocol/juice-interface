export type FeatureFlag = 'SIMULATE_TXS'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
}
