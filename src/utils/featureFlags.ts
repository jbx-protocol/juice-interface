import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'

/**
 * Example usage:
 *  
 [FEATURE_FLAGS.NFT_MP4]: {
    mainnet: true,
    goerli: true,
  }
 */
const FEATURE_FLAG_DEFAULTS: {
  [featureFlag: string]: { [networkName in NetworkName]?: boolean }
} = {
  [FEATURE_FLAGS.V1_TOKEN_SWAP]: {
    mainnet: true,
    goerli: true,
  },
  [FEATURE_FLAGS.NEW_LANDING_PAGE]: {
    mainnet: true,
    goerli: true,
  },
}

const featureFlagKey = (baseKey: string) => {
  return `${baseKey}_${readNetwork.name}`
}

export const setFeatureFlag = (featureFlag: string, enabled: boolean) => {
  localStorage &&
    localStorage.setItem(featureFlagKey(featureFlag), JSON.stringify(enabled))
  console.info('featureflags::setFeatureFlag', featureFlag, enabled)
}

export const enableFeatureFlag = (featureFlag: string) => {
  setFeatureFlag(featureFlag, true)
}

export const disableFeatureFlag = (featureFlag: string) => {
  setFeatureFlag(featureFlag, false)
}

const featureFlagDefaultEnabled = (featureFlag: string): boolean => {
  // if default-enabled for this environment, return true
  const defaultEnabled = FEATURE_FLAG_DEFAULTS[featureFlag]?.[readNetwork.name]

  return Boolean(defaultEnabled)
}

export const featureFlagEnabled = (featureFlag: string): boolean => {
  // if default-enabled for this environment, return true
  const defaultEnabled = featureFlagDefaultEnabled(featureFlag)

  try {
    const localStorageEnabled = localStorage
      ? JSON.parse(localStorage.getItem(featureFlagKey(featureFlag)) || 'null')
      : null

    return localStorageEnabled ?? defaultEnabled
  } catch (e) {
    return defaultEnabled
  }
}
