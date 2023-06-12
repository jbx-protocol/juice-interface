import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'

export const BookmarkButtonIcon = ({
  isBookmarked,
}: {
  isBookmarked: boolean
}) => {
  const className = 'inline h-5 w-5'

  return isBookmarked ? (
    <BookmarkIconSolid className={className} />
  ) : (
    <BookmarkIconOutline className={className} />
  )
}
