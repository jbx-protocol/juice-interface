import { SettingsPageKey } from '../views/V4ProjectSettings/ProjectSettingsDashboard'
import { getChainName } from './networks'

export const v4ProjectRoute = ({
  chainId,
  projectId,
}: {
  chainId: number
  projectId?: number
}) => {
  const chainName = getChainName(chainId)
  return `/v4/${chainName}/p/${projectId?.toString()}`
}

export const settingsPagePath = (
  {
    projectId,
    chainId
  }: {
    projectId: number
    chainId: number
  },
  settingsPage?: SettingsPageKey,
) => {
  return `${v4ProjectRoute({
    chainId,
    projectId,
  })}/settings/${settingsPage ?? ''}`
}

