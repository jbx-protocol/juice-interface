import { useJBChainId, useJBContractContext } from 'juice-sdk-react'

import { SettingsPageKey } from '../ProjectSettingsDashboard'
import { settingsPagePath } from 'packages/v4v5/utils/routes'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'

export function useSettingsPagePath(key?: SettingsPageKey) {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()

  if (!chainId || !projectId) {
    return undefined
  }

  if (!projectId || !chainId) {
    return ''
  }

  return settingsPagePath({ projectId: Number(projectId), chainId, version }, key)
}
