import { ConfigurationPanelDatum } from '../components/ConfigurationPanel'

export const pairToDatum = (
  name: string,
  current: string | undefined,
  upcoming: string | undefined | null,
): ConfigurationPanelDatum => {
  return {
    name,
    ...(upcoming === null ? { new: current } : { old: current, new: upcoming }),
  }
}
