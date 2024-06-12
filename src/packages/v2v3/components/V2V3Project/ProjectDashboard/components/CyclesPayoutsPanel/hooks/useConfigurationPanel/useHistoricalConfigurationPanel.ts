import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import useProjectDistributionLimit from 'packages/v2v3/hooks/contractReader/useProjectDistributionLimit'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'packages/v2v3/models/fundingCycle'
import { useFormatConfigurationCyclesSection } from './useFormatConfigurationCyclesSection'
import { useFormatConfigurationExtensionSection } from './useFormatConfigurationExtensionSection'
import { useFormatConfigurationOtherRulesSection } from './useFormatConfigurationOtherRulesSection'
import { useFormatConfigurationTokenSection } from './useFormatConfigurationTokenSection'

export const useHistoricalConfigurationPanel = ({
  fundingCycle,
  metadata,
}: {
  fundingCycle: V2V3FundingCycle
  metadata: V2V3FundingCycleMetadata
}) => {
  const { projectId } = useProjectMetadataContext()
  const { primaryETHTerminal: terminal, tokenSymbol } = useProjectContext()
  const { data: distributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: fundingCycle?.configuration?.toString(),
    terminal,
  })
  const [distributionLimit, distributionLimitCurrency] =
    distributionLimitData ?? [undefined, undefined]

  const cycle = useFormatConfigurationCyclesSection({
    fundingCycle,
    distributionLimitAmountCurrency: {
      distributionLimit,
      currency: distributionLimitCurrency,
    },
    upcomingDistributionLimitAmountCurrency: null,
    upcomingFundingCycle: null,
  })
  const token = useFormatConfigurationTokenSection({
    fundingCycle,
    fundingCycleMetadata: metadata,
    tokenSymbol,
    upcomingFundingCycle: null,
    upcomingFundingCycleMetadata: null,
  })
  const otherRules = useFormatConfigurationOtherRulesSection({
    fundingCycleMetadata: metadata,
    upcomingFundingCycleMetadata: null,
  })

  const extension = useFormatConfigurationExtensionSection({
    fundingCycleMetadata: metadata,
    upcomingFundingCycleMetadata: null,
  })

  return {
    cycle,
    token,
    otherRules,
    extension,
  }
}
