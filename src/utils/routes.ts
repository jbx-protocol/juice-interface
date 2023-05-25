import { V2V3SettingsPageKey } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/ProjectSettingsDashboard'
import { BigNumber, BigNumberish } from 'ethers'

const HELP_PAGE_HOSTNAME = 'https://docs.juicebox.money'

export const v2v3ProjectRoute = ({
  projectId,
  handle,
}: {
  projectId?: BigNumberish
  handle?: string | null
}) => {
  if (handle) return `/@${handle}`
  return `/v2/p/${BigNumber.from(projectId).toNumber()}`
}

export function helpPagePath(path: string): string {
  return new URL(path, HELP_PAGE_HOSTNAME).toString()
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
