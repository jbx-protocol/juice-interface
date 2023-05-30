import { ConfigurationPanelDatum } from '../components/ConfigurationPanel'

export const pairToDatum = (
  name: string,
  type: 'current' | 'upcoming',
  current: string | undefined,
  upcoming: string | undefined,
): ConfigurationPanelDatum => {
  return {
    name,
    ...(type === 'current'
      ? { new: current }
      : {
          old: current,
          new: upcoming,
        }),
  }
}
