import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { MenuKey, V2V3SettingsPageKey, V2VeNftPageKey } from 'models/menu-keys'
import { NextRouter } from 'next/router'

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

const HELP_PAGE_HOSTNAME = 'https://info.juicebox.money'

export function helpPagePath(path: string): string {
  return new URL(path, HELP_PAGE_HOSTNAME).toString()
}

export const settingsPagePath = (
  settingsPage: V2V3SettingsPageKey,
  {
    projectId,
    handle,
  }: {
    projectId?: BigNumberish
    handle?: string | null
  },
) => {
  return `${v2v3ProjectRoute({
    projectId,
    handle,
  })}/settings?page=${settingsPage}`
}

export const veNftPagePath = (
  settingsPage: V2VeNftPageKey,
  {
    projectId,
    handle,
  }: {
    projectId?: BigNumberish
    handle?: string | null
  },
) => {
  return `${v2v3ProjectRoute({
    projectId,
    handle,
  })}/venft?page=${settingsPage}`
}

export const pushMenuContent = (
  router: NextRouter,
  contentKey: MenuKey,
  options: { shallow?: boolean; scroll?: boolean } = {
    shallow: true,
    scroll: false,
  },
) => {
  const { shallow, scroll } = options
  router.push(
    {
      pathname: window.location.pathname,
      query: {
        page: contentKey,
      },
    },
    undefined,
    { shallow, scroll },
  )
}
