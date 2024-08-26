import { useJBContractContext } from 'juice-sdk-react'
import { settingsPagePath } from 'packages/v4/utils/routes'
import { useChainId } from 'wagmi'
import { SettingsPageKey } from '../ProjectSettingsDashboard'

export function useSettingsPagePath(key?: SettingsPageKey) {
  const { projectId } = useJBContractContext()
  const chainId = useChainId()

  return settingsPagePath({ projectId: Number(projectId), chainId }, key, )
}
