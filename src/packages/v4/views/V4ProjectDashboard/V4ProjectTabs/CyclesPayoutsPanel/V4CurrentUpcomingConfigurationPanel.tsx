import { ConfigurationPanel } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useV4CurrentUpcomingConfigurationPanel } from './hooks/useV4CurrentUpcomingConfigurationPanel'

type V4CurrentUpcomingConfigurationPanelProps = {
  type: 'current' | 'upcoming'
}

export const V4CurrentUpcomingConfigurationPanel: React.FC<
V4CurrentUpcomingConfigurationPanelProps
> = ({ type }) => {
  const props = useV4CurrentUpcomingConfigurationPanel(type)
  return <ConfigurationPanel {...props} />
}
