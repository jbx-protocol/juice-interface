import { Trans } from '@lingui/macro'
import { BookmarkButtonIcon } from 'components/BookmarkButton/BookmarkButtonIcon'
import { useBookmarkButton } from 'components/BookmarkButton/hooks/useBookmarkButton'
import { SubscribeButtonIcon } from 'components/SubscribeButton/SubscribeButtonIcon'
import { useSubscribeButton } from 'components/SubscribeButton/hooks/useSubscribeButton'
import { PV_V2 } from 'constants/pv'
import { PopupMenu } from '../../PopupMenu/PopupMenu'

export function ProjectHeaderPopupMenu({ projectId }: { projectId: number }) {
  const { isBookmarked, onBookmarkButtonClicked } = useBookmarkButton({
    projectId,
    pv: PV_V2,
  })
  const { isSubscribed, onSubscribeButtonClicked } = useSubscribeButton({
    projectId,
  })

  return (
    <PopupMenu
      menuButtonIconClassName="h-8 w-8"
      items={[
        {
          id: 'bookmark',
          label: (
            <>
              <BookmarkButtonIcon
                isBookmarked={isBookmarked}
                className="h-5 w-5"
              />
              <span className="whitespace-nowrap text-sm font-medium">
                <Trans>Bookmark project</Trans>
              </span>
            </>
          ),
          onClick(ev) {
            ev.preventDefault()
            ev.stopPropagation()

            onBookmarkButtonClicked()
          },
        },
        {
          id: 'subscribe',
          label: (
            <>
              <SubscribeButtonIcon
                isSubscribed={isSubscribed}
                className="h-5 w-5"
              />

              <span className="whitespace-nowrap text-sm font-medium">
                <Trans>Subscribe to updates</Trans>
              </span>
            </>
          ),
          onClick: onSubscribeButtonClicked,
        },
      ]}
    />
  )
}
