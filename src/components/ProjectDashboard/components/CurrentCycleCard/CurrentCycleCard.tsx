import { LockClosedIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { useCurrentCycleCard } from 'components/ProjectDashboard/hooks'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { DisplayCard } from '../ui'

export const CurrentCycleCard = ({ className }: { className?: string }) => {
  const { currentCycleNumber, timeLeftInCycle } = useCurrentCycleCard()
  const timeRemainingText = useMemo(() => {
    const days = Math.floor(timeLeftInCycle / 86400)
    const hours = Math.floor((timeLeftInCycle % 86400) / 3600)
    const minutes = Math.floor(((timeLeftInCycle % 86400) % 3600) / 60)
    const seconds = Math.floor(((timeLeftInCycle % 86400) % 3600) % 60)
    return `${days}D ${hours}H ${minutes}M ${seconds}S`
  }, [timeLeftInCycle])

  return (
    <DisplayCard className={twMerge('pr-9', className)}>
      <div className="font-medium">
        <Trans>Current Cycle: #{currentCycleNumber}</Trans>
      </div>
      <div className="mt-6 flex items-center gap-1">
        <span className="text-2xl font-medium">{timeRemainingText}</span>
        <LockClosedIcon className="h-4 w-4 text-smoke-400" />
      </div>
      <div className="mt-3 text-smoke-500">
        <Trans>until Cycle #{currentCycleNumber + 1}</Trans>
      </div>
    </DisplayCard>
  )
}
