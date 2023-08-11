import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { BookmarkButtonIcon } from 'components/BookmarkButton/BookmarkButtonIcon'
import { useBookmarkButton } from 'components/BookmarkButton/hooks/useBookmarkButton'
import { SubscribeButtonIcon } from 'components/SubscribeButton/SubscribeButtonIcon'
import { useSubscribeButton } from 'components/SubscribeButton/hooks/useSubscribeButton'
import { V2V3ProjectToolsDrawer } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer'
import { PV_V2 } from 'constants/pv'
import { useState } from 'react'
import { PopupMenu } from '../../../../ui/PopupMenu'

export function ProjectHeaderPopupMenu({ projectId }: { projectId: number }) {
  const [toolsIsOpen, setToolsIsOpen] = useState<boolean>()

  const { isBookmarked, onBookmarkButtonClicked } = useBookmarkButton({
    projectId,
    pv: PV_V2,
  })
  const { isSubscribed, onSubscribeButtonClicked } = useSubscribeButton({
    projectId,
  })

  return (
    <>
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
          {
            id: 'tools',
            label: (
              <>
                <EllipsisVerticalIcon className="h-5 w-5" />

                <span className="whitespace-nowrap text-sm font-medium">
                  <Trans>Advanced tools</Trans>
                </span>
              </>
            ),
            onClick: ev => {
              ev.preventDefault()
              ev.stopPropagation()

              setToolsIsOpen(true)
            },
          },
        ]}
      />

      <V2V3ProjectToolsDrawer
        open={toolsIsOpen}
        onClose={() => setToolsIsOpen(false)}
      />
    </>
  )
}
