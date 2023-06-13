import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'

export const BookmarkButtonIcon = ({
  isBookmarked,
}: {
  isBookmarked: boolean
}) => {
  const className = 'inline h-6 w-6'

  return isBookmarked ? (
    <BookmarkIconSolid className={className} />
  ) : (
    <BookmarkIconOutline className={className} />
  )
}
