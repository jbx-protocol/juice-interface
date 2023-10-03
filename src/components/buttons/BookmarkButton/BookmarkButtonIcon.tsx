import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'
import { twMerge } from 'tailwind-merge'

export const BookmarkButtonIcon = ({
  isBookmarked,
  className,
}: {
  isBookmarked: boolean
  className?: string
}) => {
  const Icon = isBookmarked ? BookmarkIconSolid : BookmarkIconOutline

  return <Icon className={twMerge('inline h-6 w-6', className)} />
}
