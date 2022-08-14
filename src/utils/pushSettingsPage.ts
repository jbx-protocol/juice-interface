import { NextRouter } from 'next/router'
import { V2SettingsContentKey } from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettings'

export const pushSettingsContent = (
  router: NextRouter,
  contentKey: V2SettingsContentKey,
  options: { shallow?: boolean } = { shallow: true },
) => {
  const { shallow } = options
  router.push(
    {
      pathname: router.pathname,
      query: {
        page: 'settings',
        settingsPage: contentKey,
      },
    },
    undefined,
    { shallow, scroll: true },
  )
}
