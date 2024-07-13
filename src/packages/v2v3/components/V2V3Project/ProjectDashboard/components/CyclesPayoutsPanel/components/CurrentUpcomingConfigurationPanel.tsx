import { ConfigurationPanel } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useCurrentUpcomingConfigurationPanel } from '../hooks/useConfigurationPanel/useCurrentUpcomingConfigurationPanel'

type CurrentUpcomingConfigurationPanelProps = {
  type: 'current' | 'upcoming'
}

export const CurrentUpcomingConfigurationPanel: React.FC<
  CurrentUpcomingConfigurationPanelProps
> = ({ type }) => {
  const props = useCurrentUpcomingConfigurationPanel(type)
  return <ConfigurationPanel {...props} />
}
