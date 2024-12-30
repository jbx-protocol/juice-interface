import { useJBChainId, useJBContractContext } from 'juice-sdk-react'
import { settingsPagePath } from 'packages/v4/utils/routes'
import { SettingsPageKey } from '../ProjectSettingsDashboard'

export function useSettingsPagePath(key?: SettingsPageKey) {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()

  return settingsPagePath({ projectId: Number(projectId), chainId }, key)
}
