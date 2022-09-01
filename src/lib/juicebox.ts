import {
  disableFeatureFlag,
  enableFeatureFlag,
  featureFlagEnabled,
} from 'utils/featureFlags'

export function installJuiceboxWindowObject() {
  if (!window) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).jb = {
    enableFeatureFlag,
    disableFeatureFlag,
    featureFlagEnabled,
  }
}
