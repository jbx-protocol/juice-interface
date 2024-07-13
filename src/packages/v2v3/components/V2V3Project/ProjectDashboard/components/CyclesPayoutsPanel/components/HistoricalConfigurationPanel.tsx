import { ConfigurationPanel } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'packages/v2v3/models/fundingCycle'
import { useHistoricalConfigurationPanel } from '../hooks/useConfigurationPanel/useHistoricalConfigurationPanel'
import { HistoricalPayoutsData } from './HistoricalPayoutsData'

export type HistoricalConfigurationPanelProps = {
  fundingCycle: V2V3FundingCycle
  metadata: V2V3FundingCycleMetadata
  withdrawnAmountAndCurrency: {
    amount: number
    currency: V2V3CurrencyOption
  }
}

export const HistoricalConfigurationPanel: React.FC<
  HistoricalConfigurationPanelProps
> = p => {
  const props = useHistoricalConfigurationPanel(p)

  return (
    <div className="flex flex-col gap-8">
      <ConfigurationPanel {...props} />
      <HistoricalPayoutsData {...p} />
    </div>
  )
}
