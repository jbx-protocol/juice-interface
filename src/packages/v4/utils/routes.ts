import { SettingsPageKey } from '../views/V4ProjectSettings/ProjectSettingsDashboard'
import { getChainSlug } from './networks'

export const v4ProjectRoute = ({
  chainId,
  projectId,
}: {
  chainId: number
  projectId?: number
}) => {
  const chainSlug = getChainSlug(chainId)
  return `/v4/${chainSlug}/p/${projectId?.toString()}`
}

export const settingsPagePath = (
  {
    projectId,
    chainId,
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
