import { useCurrentUpcomingConfigurationPanel } from '../hooks/useConfigurationPanel/useCurrentUpcomingConfigurationPanel'
import { ConfigurationPanel } from './ConfigurationPanel'

type CurrentUpcomingConfigurationPanelProps = {
  type: 'current' | 'upcoming'
}

export const CurrentUpcomingConfigurationPanel: React.FC<
  CurrentUpcomingConfigurationPanelProps
> = ({ type }) => {
  const props = useCurrentUpcomingConfigurationPanel(type)
  return <ConfigurationPanel {...props} />
}
