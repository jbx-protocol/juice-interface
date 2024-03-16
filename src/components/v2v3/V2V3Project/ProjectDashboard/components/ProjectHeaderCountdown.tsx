// import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { ReactNode, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { useFundingCycleCountdown } from '../hooks/useFundingCycleCountdown'

type ProjectHeaderCountdownProps = {
  className?: string
}

export const ProjectHeaderCountdown: React.FC<ProjectHeaderCountdownProps> = ({
  className,
}) => {
  // const { projectId } = useProjectMetadataContext()
  const { secondsRemaining } = useFundingCycleCountdown()

  const { days, hours, minutes, seconds } = useMemo(() => {
    const days = Math.floor(secondsRemaining / (3600 * 24))
    const hours = Math.floor((secondsRemaining % (3600 * 24)) / 3600)
    const minutes = Math.floor((secondsRemaining % 3600) / 60)
    const seconds = Math.floor(secondsRemaining % 60)
    return { days, hours, minutes, seconds }
  }, [secondsRemaining])

  // Project header countdown is disbaled. We might want to enable it in the future.
  return null

  if (secondsRemaining === 0) return null

  return (
    <div
      className={twMerge(
        'absolute bottom-5 left-1/2 mx-auto flex w-full max-w-6xl -translate-x-1/2 flex-col items-end pr-2 sm:flex-row sm:items-center sm:justify-end sm:pr-4 md:pr-5 xl:pr-0',
        className,
      )}
    >
      <div className="mr-3 text-lg text-white">Closing in</div>
      <div className="flex gap-1 sm:gap-3">
        <CountdownCard label="DAYS" unit={days} />
        <CountdownCard label="HRS" unit={hours} />
        <CountdownCard label="MINS" unit={minutes} />
        <CountdownCard label="SECS" unit={seconds} />
      </div>
    </div>
  )
}

const CountdownCard = ({ label, unit }: { label: ReactNode; unit: number }) => (
  <div className="flex w-11 flex-1 flex-col items-center rounded-lg border border-smoke-75 bg-smoke-50 py-1 px-1 text-black drop-shadow dark:border-slate-400 dark:bg-slate-700 dark:text-white sm:px-1.5">
    <div className="text-sm sm:text-xl">{unit}</div>
    <div className="text-xs font-medium text-grey-500 dark:text-slate-200">
      {label}
    </div>
  </div>
)
