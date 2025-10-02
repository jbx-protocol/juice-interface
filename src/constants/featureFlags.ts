export type FeatureFlag = 'SIMULATE_TXS' | 'V4' | 'V5' | 'OFAC'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  V4: 'v4',
  V5: 'v5',
  OFAC: 'ofac',
}
