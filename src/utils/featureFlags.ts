import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'

const FEATURE_FLAG_DEFAULTS: {
  [featureFlag: string]: { [networkName: string]: boolean }
} = {
  [FEATURE_FLAGS.NFT_REWARDS]: {
    rinkeby: true,
  },
  [FEATURE_FLAGS.VENFT]: {
    rinkeby: true,
  },
  [FEATURE_FLAGS.VENFT_CREATOR]: {
    rinkeby: true,
  },
}

const featureFlagKey = (baseKey: string) => {
  return `${baseKey}_${readNetwork.name}`
}

const setFeatureFlag = (featureFlag: string, enabled: boolean) => {
  localStorage &&
    localStorage.setItem(featureFlagKey(featureFlag), JSON.stringify(enabled))
}

export const enableFeatureFlag = (featureFlag: string) => {
  setFeatureFlag(featureFlag, true)
}

export const disableFeatureFlag = (featureFlag: string) => {
  setFeatureFlag(featureFlag, false)
}

const featureFlagDefaultEnabled = (featureFlag: string): boolean => {
  // if default-enabled for this environment, return true
  const defaultEnabled =
    FEATURE_FLAG_DEFAULTS[featureFlag]?.[readNetwork.name as string]

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
