import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { twMerge } from 'tailwind-merge'
import { useProtocolActivity } from './ProtocolActivityContext'

export default function ProtocolActivityToggle({
  className,
}: {
  className?: string
}) {
  const { toggle, isOpen } = useProtocolActivity()

  return (
    <div
      className={twMerge(
        'cursor-pointer hover:text-bluebs-500 hover:dark:text-bluebs-300',
        isOpen && 'text-bluebs-500 dark:text-bluebs-300',
        className,
      )}
      onClick={toggle}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-6 w-6">
          <Bars3BottomLeftIcon className="h-6 w-6" />
        </div>
        <span className="font-medium md:hidden">Protocol Activity</span>
      </div>
    </div>
  )
}
