import { useJBChainId, useJBContractContext } from 'juice-sdk-react'

import { SettingsPageKey } from '../ProjectSettingsDashboard'
import { settingsPagePath } from 'packages/v4/utils/routes'

export function useSettingsPagePath(key?: SettingsPageKey) {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  if (!chainId || !projectId) {
    return undefined
  }

  if (!projectId || !chainId) {
    return ''
  }

  return settingsPagePath({ projectId: Number(projectId), chainId }, key)
}
