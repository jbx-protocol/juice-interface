import { BellIcon as BellIconOutline } from '@heroicons/react/24/outline'
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

export const SubscribeButtonIcon = ({
  className,
  isSubscribed,
}: {
  className?: string
  isSubscribed: boolean
}) => {
  const Icon = useMemo(() => {
    if (isSubscribed) {
      return BellIconSolid
    }
    return BellIconOutline
  }, [isSubscribed])

  return <Icon className={twMerge('inline h-6 w-6', className)} />
}
