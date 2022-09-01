import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2SettingsKey } from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'
import { NextRouter } from 'next/router'

export const v2ProjectRoute = ({
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
  settingsPage: V2SettingsKey,
  {
    projectId,
    handle,
  }: {
    projectId?: BigNumberish
    handle?: string | null
  },
) => {
  return `${v2ProjectRoute({
    projectId,
    handle,
  })}/settings?page=${settingsPage}`
}

export const pushSettingsContent = (
  router: NextRouter,
  contentKey: V2SettingsKey,
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
