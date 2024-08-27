import { BigNumber, BigNumberish } from 'ethers'
import { V2V3SettingsPageKey } from 'packages/v2v3/components/V2V3Project/V2V3ProjectSettings/ProjectSettingsDashboard'
import qs from 'qs'

export const v2v3ProjectRoute = ({
  projectId,
  handle,
  query,
}: {
  projectId?: BigNumberish
  handle?: string | null
  query?: Record<string, string>
}) => {
  const route = handle
    ? `/@${handle}`
    : `/v2/p/${BigNumber.from(projectId).toNumber()}`

  return `${route}${query ? `?${qs.stringify(query)}` : ''}`
}

export const settingsPagePath = (
  settingsPage?: V2V3SettingsPageKey,
  {
    projectId,
    handle,
  }: {
    projectId?: BigNumberish
    handle?: string | null
  } = {},
) => {
  return `${v2v3ProjectRoute({
    projectId,
    handle,
  })}/settings/${settingsPage ?? ''}`
}
