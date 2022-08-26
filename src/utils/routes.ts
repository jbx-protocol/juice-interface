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

export const pushSettingsContent = (
  router: NextRouter,
  contentKey: V2SettingsKey,
  projectId: number | undefined,
  options: { shallow?: boolean } = { shallow: true },
) => {
  const { shallow } = options
  router.push(
    {
      pathname: `/v2/p/${projectId}/settings`,
      query: {
        page: contentKey,
      },
    },
    undefined,
    { shallow, scroll: true },
  )
}
