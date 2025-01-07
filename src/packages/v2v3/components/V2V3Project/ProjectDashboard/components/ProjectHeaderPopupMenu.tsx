import {
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { SocialLinkButton } from 'components/Project/ProjectHeader/SocialLinkButton'
import { useSocialLinks } from 'components/Project/ProjectHeader/hooks/useSocialLinks'
import { BookmarkButtonIcon } from 'components/buttons/BookmarkButton/BookmarkButtonIcon'
import { useBookmarkButton } from 'components/buttons/BookmarkButton/hooks/useBookmarkButton'
import { SubscribeButtonIcon } from 'components/buttons/SubscribeButton/SubscribeButtonIcon'
import { useSubscribeButton } from 'components/buttons/SubscribeButton/hooks/useSubscribeButton'
import { PopupMenu } from 'components/ui/PopupMenu'
import { PV_V2 } from 'constants/pv'
import useMobile from 'hooks/useMobile'
import { useV2V3WalletHasPermission } from 'packages/v2v3/hooks/contractReader/useV2V3WalletHasPermission'
import { V2V3OperatorPermission } from 'packages/v2v3/models/v2v3Permissions'
import { settingsPagePath } from 'packages/v2v3/utils/routes'
import { useMemo, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { V2V3ProjectToolsDrawer } from '../../V2V3ProjectToolsDrawer'
import { useV2V3ProjectHeader } from '../hooks/useV2V3ProjectHeader'

type SocialLink = 'twitter' | 'discord' | 'telegram' | 'website'

export function ProjectHeaderPopupMenu({
  className,
  projectId,
}: {
  className?: string
  projectId: number
}) {
  const { handle } = useV2V3ProjectHeader()
  const socialLinks = useSocialLinks()
  const isMobile = useMobile()
  const canReconfigure = useV2V3WalletHasPermission(
    V2V3OperatorPermission.RECONFIGURE,
  )
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
          {
            id: 'subscribe',
            label: (
              <>
                <SubscribeButtonIcon
                  isSubscribed={isSubscribed}
                  className="h-5 w-5"
                />

                <span className="whitespace-nowrap text-sm font-medium">
                  <Trans>Get notifications</Trans>
                </span>
              </>
            ),
            onClick: onSubscribeButtonClicked,
          },
          {
            id: 'bookmark',
            label: (
              <>
                <BookmarkButtonIcon
                  isBookmarked={isBookmarked}
                  className="h-5 w-5"
                />
                <span className="whitespace-nowrap text-sm font-medium">
                  <Trans>Save project</Trans>
                </span>
              </>
            ),
            onClick(ev) {
              ev.preventDefault()
              ev.stopPropagation()

              onBookmarkButtonClicked()
            },
          },
          ...(isMobile && canReconfigure
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
                  href: settingsPagePath(undefined, { handle, projectId }),
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

      <V2V3ProjectToolsDrawer
        open={toolsIsOpen}
        onClose={() => setToolsIsOpen(false)}
      />
    </>
  )
}
