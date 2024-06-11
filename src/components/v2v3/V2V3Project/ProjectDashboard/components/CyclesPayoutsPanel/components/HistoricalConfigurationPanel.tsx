import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useHistoricalConfigurationPanel } from '../hooks/useConfigurationPanel/useHistoricalConfigurationPanel'
import { ConfigurationPanel } from './ConfigurationPanel'
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
