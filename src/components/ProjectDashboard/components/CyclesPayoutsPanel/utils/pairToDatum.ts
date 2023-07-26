import { ConfigurationPanelDatum } from '../components/ConfigurationPanel'

export const pairToDatum = (
  name: string,
  current: string | undefined,
  upcoming: string | undefined | null,
  link?: string,
  easyCopy?: boolean,
): ConfigurationPanelDatum => {
  return {
    name,
    ...(upcoming === null ? { new: current } : { old: current, new: upcoming }),
    link,
    easyCopy,
  }
}
