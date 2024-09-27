import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useBookmarkButton } from 'components/buttons/BookmarkButton/hooks/useBookmarkButton'
import { useSubscribeButton } from 'components/buttons/SubscribeButton/hooks/useSubscribeButton'
import { PV_V2 } from 'constants/pv'
import useMobile from 'hooks/useMobile'
import { V2V3ProjectToolsDrawer } from 'packages/v2v3/components/V2V3Project/V2V3ProjectToolsDrawer'
import { useMemo, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { PopupMenu } from '../../ui/PopupMenu'
import { SocialLinkButton } from './SocialLinkButton'
import { useSocialLinks } from './hooks/useSocialLinks'

type SocialLink = 'twitter' | 'discord' | 'telegram' | 'website'

export function ProjectHeaderPopupMenu({
  className,
  projectId,
}: {
  className?: string
  projectId: number
}) {
  const socialLinks = useSocialLinks()
  const isMobile = useMobile()
  const [toolsIsOpen, setToolsIsOpen] = useState<boolean>()

  const { isBookmarked, onBookmarkButtonClicked } = useBookmarkButton({
    projectId,
    pv: PV_V2,
  })
  const { isSubscribed, onSubscribeButtonClicked } = useSubscribeButton({
    projectId,
  })

  const socialItems = useMemo(
    () => Object.entries(socialLinks).filter(([, href]) => !!href),
    [socialLinks],
  ) as [string, string][]

  return (
    <>
      <PopupMenu
        className={twJoin('z-20', className)}
        menuButtonIconClassName="h-8 w-8"
        items={[
          ...(isMobile
            ? socialItems.map(([type, href]) => ({
                id: type,
                label: (
                  <SocialLinkButton type={type as SocialLink} href={href} />
                ),
                href,
              }))
            : []),
          // {
          //   id: 'subscribe',
          //   label: (
          //     <>
          //       <SubscribeButtonIcon
          //         isSubscribed={isSubscribed}
          //         className="h-5 w-5"
          //       />

          //       <span className="whitespace-nowrap text-sm font-medium">
          //         <Trans>Get notifications</Trans>
          //       </span>
          //     </>
          //   ),
          //   onClick: onSubscribeButtonClicked,
          // },
          // {
          //   id: 'bookmark',
          //   label: (
          //     <>
          //       <BookmarkButtonIcon
          //         isBookmarked={isBookmarked}
          //         className="h-5 w-5"
          //       />
          //       <span className="whitespace-nowrap text-sm font-medium">
          //         <Trans>Save project</Trans>
          //       </span>
          //     </>
          //   ),
          //   onClick(ev) {
          //     ev.preventDefault()
          //     ev.stopPropagation()

          //     onBookmarkButtonClicked()
          //   },
          // },
          {
            id: 'tools',
            label: (
              <>
                <WrenchScrewdriverIcon className="h-5 w-5" />

                <span className="whitespace-nowrap text-sm font-medium">
                  <Trans>Tools</Trans>
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
