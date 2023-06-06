import { Button, Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/lib/tooltip'
import { PV } from 'models/pv'
import { BookmarkButtonIcon } from './BookmarkButtonIcon'
import { useBookmarkButton } from './hooks/useBookmarkButton'

interface BookmarkButtonProps {
  projectId: number
  pv: PV
  tooltipPlacement?: TooltipPlacement
}

export default function BookmarkButton({
  projectId,
  pv,
  tooltipPlacement,
}: BookmarkButtonProps) {
  const { loading, isBookmarked, onBookmarkButtonClicked } = useBookmarkButton({
    projectId,
    pv,
  })

  return (
    <>
      <Tooltip
        placement={tooltipPlacement}
        title={isBookmarked ? 'Saved' : 'Save project'}
      >
        <Button
          className="flex items-center gap-x-2 p-0"
          type="text"
          onClick={onBookmarkButtonClicked}
          loading={loading}
          icon={<BookmarkButtonIcon isBookmarked={isBookmarked} />}
        />
      </Tooltip>
    </>
  )
}
