import { useJBChainId, useJBContractContext } from 'juice-sdk-react'
import { settingsPagePath } from 'packages/v4/utils/routes'
import { SettingsPageKey } from '../ProjectSettingsDashboard'

export function useSettingsPagePath(key?: SettingsPageKey) {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  if (!chainId || !projectId) {
    return undefined
  }

  return settingsPagePath({ projectId: Number(projectId), chainId }, key)
}
