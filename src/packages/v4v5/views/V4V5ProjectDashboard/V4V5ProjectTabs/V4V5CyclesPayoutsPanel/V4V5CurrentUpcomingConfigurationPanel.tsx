import { ConfigurationPanel } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useV4V5CurrentUpcomingConfigurationPanel } from './hooks/useV4V5CurrentUpcomingConfigurationPanel'

type V4V5CurrentUpcomingConfigurationPanelProps = {
  type: 'current' | 'upcoming'
}

export const V4V5CurrentUpcomingConfigurationPanel: React.FC<
V4V5CurrentUpcomingConfigurationPanelProps
> = ({ type }) => {
  const props = useV4V5CurrentUpcomingConfigurationPanel(type)
  return <ConfigurationPanel {...props} />
}
