import {
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { SocialLinkButton } from 'components/Project/ProjectHeader/SocialLinkButton'
import { useSocialLinks } from 'components/Project/ProjectHeader/hooks/useSocialLinks'
import { PopupMenu } from 'components/ui/PopupMenu'
import useMobile from 'hooks/useMobile'
import { useJBChainId } from 'juice-sdk-react'
import { useV4WalletHasPermission } from 'packages/v4v5/hooks/useV4V5WalletHasPermission'
import { V4V5OperatorPermission } from 'packages/v4v5/models/v4Permissions'
import { settingsPagePath } from 'packages/v4v5/utils/routes'
import { useMemo, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { V4ProjectToolsDrawer } from './V4V5ProjectToolsDrawer'

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
  const canQueueRuleSets = useV4WalletHasPermission(
    V4V5OperatorPermission.QUEUE_RULESETS,
  )
  const chainId = useJBChainId()
  const [toolsIsOpen, setToolsIsOpen] = useState<boolean>()

  // const { isBookmarked, onBookmarkButtonClicked } = useBookmarkButton({
  //   projectId,
  //   pv: PV_V2,
  // })
  // const { isSubscribed, onSubscribeButtonClicked } = useSubscribeButton({
  //   projectId,
  // })

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
          ...(isMobile && chainId && canQueueRuleSets
            ? [
                {
                  id: 'manage',
                  label: (
                    <>
                      <Cog6ToothIcon className="text-primary h-5 w-5" />

                      <span className="text-primary whitespace-nowrap text-sm font-medium">
                        <Trans>Manage project</Trans>
                      </span>
                    </>
                  ),
                  href: settingsPagePath({ chainId, projectId }),
                },
              ]
            : []),
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

      <V4V5ProjectToolsDrawer
        open={toolsIsOpen}
        onClose={() => setToolsIsOpen(false)}
      />
    </>
  )
}
