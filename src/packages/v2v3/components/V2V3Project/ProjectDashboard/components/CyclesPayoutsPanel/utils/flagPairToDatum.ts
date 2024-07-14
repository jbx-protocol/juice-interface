import { t } from '@lingui/macro'
import { pairToDatum } from 'components/Project/ProjectHeader/utils/pairToDatum'
import { ConfigurationPanelDatum } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'

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