import { V2SettingsKey } from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'
import { NextRouter } from 'next/router'

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
