import { t } from '@lingui/macro'
import { ConfigurationPanelDatum } from '../components/ConfigurationPanel'
import { pairToDatum } from './pairToDatum'

export const flagPairToDatum = (
  name: string,
  type: 'current' | 'upcoming',
  currentFlag: boolean | undefined,
  upcomingFlag: boolean | undefined,
): ConfigurationPanelDatum => {
  const current =
    currentFlag !== undefined
      ? currentFlag === true
        ? t`Enabled`
        : t`Disabled`
      : undefined
  const upcoming =
    upcomingFlag !== undefined
      ? upcomingFlag === true
        ? t`Enabled`
        : t`Disabled`
      : undefined
  return pairToDatum(name, type, current, upcoming)
}
