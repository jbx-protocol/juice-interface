import { t } from '@lingui/macro'
import { ConfigurationPanelDatum } from '../components/ConfigurationPanel'
import { pairToDatum } from './pairToDatum'

export const flagPairToDatum = (
  name: string,
  currentFlag: boolean | undefined,
  upcomingFlag: boolean | undefined | null,
  link?: string,
  easyCopy?: boolean,
): ConfigurationPanelDatum => {
  const current =
    currentFlag !== undefined
      ? currentFlag === true
        ? t`Enabled`
        : t`Disabled`
      : undefined
  const upcoming =
    upcomingFlag !== null
      ? upcomingFlag !== undefined
        ? upcomingFlag === true
          ? t`Enabled`
          : t`Disabled`
        : undefined
      : null
  return pairToDatum(name, current, upcoming, link, easyCopy)
}
