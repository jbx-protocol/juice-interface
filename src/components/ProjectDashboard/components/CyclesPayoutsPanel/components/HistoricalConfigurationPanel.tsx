import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useHistoricalConfigurationPanel } from '../hooks/useConfigurationPanel/useHistoricalConfigurationPanel'
import { ConfigurationPanel } from './ConfigurationPanel'

type HistoricalConfigurationPanelProps = {
  fundingCycle: V2V3FundingCycle
  metadata: V2V3FundingCycleMetadata
}

export const HistoricalConfigurationPanel: React.FC<
  HistoricalConfigurationPanelProps
> = p => {
  const props = useHistoricalConfigurationPanel(p)
  return <ConfigurationPanel {...props} />
}
