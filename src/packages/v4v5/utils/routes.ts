import { SettingsPageKey } from '../views/V4V5ProjectSettings/ProjectSettingsDashboard'
import { getChainSlug } from './networks'

export const v4ProjectRoute = ({
  chainId,
  projectId,
}: {
  chainId: number
  projectId?: number
}) => {
  const chainSlug = getChainSlug(chainId)
  return `/v4/${chainSlug}:${projectId?.toString()}`
}

export const v5ProjectRoute = ({
  chainId,
  projectId,
}: {
  chainId: number
  projectId?: number
}) => {
  const chainSlug = getChainSlug(chainId)
  return `/v5/${chainSlug}:${projectId?.toString()}`
}

export const v4v5ProjectRoute = ({
  chainId,
  projectId,
  version,
}: {
  chainId: number
  projectId?: number
  version: 4 | 5
}) => {
  const chainSlug = getChainSlug(chainId)
  return `/v${version}/${chainSlug}:${projectId?.toString()}`
}

export const settingsPagePath = (
  {
    projectId,
    chainId,
    version = 4,
  }: {
    projectId: number
    chainId: number
    version?: 4 | 5
  },
  settingsPage?: SettingsPageKey,
) => {
  return `${v4v5ProjectRoute({
    chainId,
    projectId,
    version,
  })}/settings/${settingsPage ?? ''}`
}