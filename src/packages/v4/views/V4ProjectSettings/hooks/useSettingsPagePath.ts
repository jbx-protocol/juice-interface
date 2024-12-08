import { useJBContractContext } from 'juice-sdk-react'
import { useCurrentRouteChainId } from 'packages/v4/hooks/useCurrentRouteChainId'
import { settingsPagePath } from 'packages/v4/utils/routes'
import { SettingsPageKey } from '../ProjectSettingsDashboard'
export function useSettingsPagePath(key?: SettingsPageKey) {
  const { projectId } = useJBContractContext()
  const chainId = useCurrentRouteChainId()
  if (!chainId) {
    return undefined
  }

  return settingsPagePath({ projectId: Number(projectId), chainId }, key)
}
