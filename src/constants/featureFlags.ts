export type FeatureFlag =
  | 'SIMULATE_TXS'
  | 'JUICE_CROWD_METADATA_CONFIGURATION'
  | 'PRIVY_DEBUG_TOOLS'

export const FEATURE_FLAGS: { [k in FeatureFlag]: string } = {
  SIMULATE_TXS: 'simulateTxs',
  /**
   * This feature flag is used to enable juicecrowd specific metadata
   * configuration options. This is a temporary flag that will be removed
   * once creation is available on juicecrowd.
   */
  JUICE_CROWD_METADATA_CONFIGURATION: 'juiceCrowdMetadataConfiguration',

  PRIVY_DEBUG_TOOLS: 'privyDebugTools',
}
