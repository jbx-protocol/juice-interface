import { BellIcon as BellIconOutline } from '@heroicons/react/24/outline'
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid'

export const SubscribeButtonIcon = ({
  isSubscribed,
}: {
  isSubscribed: boolean
}) => {
  return isSubscribed ? (
    <BellIconSolid className="inline h-6 w-6" />
  ) : (
    <BellIconOutline className="inline h-6 w-6" />
  )
}
