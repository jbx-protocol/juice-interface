import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useUpcomingPayoutLimit } from 'packages/v4/hooks/useUpcomingPayoutLimit'

export const useV4CurrentUpcomingPayoutLimit = (
  type: 'current' | 'upcoming',
) => {
  const { data: payoutLimit, isLoading: currentLoading } = usePayoutLimit()

  const { data: upcomingPayoutLimit, isLoading: upcomingLoading } = useUpcomingPayoutLimit()

  if (type === 'current') {
    return {
      payoutLimit: payoutLimit?.amount,
      payoutLimitCurrency: payoutLimit?.currency,
      loading: currentLoading,
    }
  }
  return {
    distributionLimit: upcomingPayoutLimit.amount,
    distributionLimitCurrency: upcomingPayoutLimit.currency,
    loading: upcomingLoading
  }
}
