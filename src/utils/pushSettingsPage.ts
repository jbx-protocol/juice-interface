import { NextRouter } from 'next/router'
import { V2SettingsKey } from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'

export const pushSettingsContent = (
  router: NextRouter,
  contentKey: V2SettingsKey,
  options: { shallow?: boolean } = { shallow: true },
) => {
  const { shallow } = options
  router.push(
    {
      pathname: router.pathname,
      query: {
        page: contentKey,
      },
    },
    undefined,
    { shallow, scroll: true },
  )
}
