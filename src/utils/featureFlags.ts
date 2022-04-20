import { readNetwork } from 'constants/networks'

export const FEATURE_FLAGS = {
  ENABLE_V2: 'ENABLE_V2',
}

const DEFAULTS: { [k: string]: { [j: string]: boolean } } = {
  [FEATURE_FLAGS.ENABLE_V2]: {
    rinkeby: true,
    mainnet: false,
  },
}

const featureFlagKey = (baseKey: string) => {
  return `${baseKey}_${readNetwork.name}`
}

export const setFeatureFlag = (featureFlag: string, enabled: boolean) => {
  localStorage.setItem(featureFlagKey(featureFlag), JSON.stringify(enabled))
}

export const enableFeatureFlag = (featureFlag: string) => {
  setFeatureFlag(featureFlag, true)
}

export const disableFeatureFlag = (featureFlag: string) => {
  setFeatureFlag(featureFlag, false)
}

export const featureFlagEnabled = (featureFlag: string) => {
  // if default-enabled for this environment, return trues
  if (DEFAULTS[featureFlag][readNetwork.name as string]) return true

  try {
    return JSON.parse(localStorage.getItem(featureFlagKey(featureFlag)) || '')
  } catch (e) {
    return false
  }
}
