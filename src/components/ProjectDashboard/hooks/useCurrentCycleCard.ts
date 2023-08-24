import { useTreasuryStats } from '../components/CyclesPayoutsPanel/hooks/useTreasuryStats'

export const useCurrentBalanceCard = () => {
  const { treasuryBalance } = useTreasuryStats()

  return { treasuryBalance }
}
