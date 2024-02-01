import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
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
