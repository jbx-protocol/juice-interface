import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'

export const useV4CycleSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  return {
    duration: {
      name: 'Duration',
      new: '60 days',
    }
  }
  // const { projectId } = useProjectMetadataContext()

  // const {
  //   fundingCycle,
  //   distributionLimit,
  //   distributionLimitCurrency,
  //   primaryETHTerminal,
  // } = useProjectContext()
  // const { data: upcomingFundingCycleData } = useProjectUpcomingFundingCycle({
  //   projectId,
  // })
  // const [upcomingFundingCycle] = upcomingFundingCycleData ?? []

  // const { data: upcomingDistributionLimitData } = useProjectDistributionLimit({
  //   projectId,
  //   configuration: upcomingFundingCycle?.configuration.toString(),
  //   terminal: primaryETHTerminal,
  // })
  // const [upcomingDistributionLimit, upcomingDistributionLimitCurrency] =
  //   upcomingDistributionLimitData ?? []

  // return useFormatConfigurationCyclesSection({
  //   fundingCycle,
  //   distributionLimitAmountCurrency: {
  //     distributionLimit: distributionLimit,
  //     currency: distributionLimitCurrency,
  //   },

  //   upcomingFundingCycle,
  //   upcomingDistributionLimitAmountCurrency: {
  //     distributionLimit: upcomingDistributionLimit,
  //     currency: upcomingDistributionLimitCurrency,
  //   },

  //   // Hide upcoming info from current section.
  //   ...(type === 'current' && {
  //     upcomingFundingCycle: null,
  //     upcomingDistributionLimitAmountCurrency: null,
  //   }),
  // })
}
