import { Announcements } from 'constants/announcements'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useWallet } from 'hooks/Wallet'
import { useIsUserAddress } from 'hooks/useIsUserAddress'
import { Announcement } from 'models/announcement'
import { useRouter } from 'next/router'
import React, {
  startTransition,
  useCallback,
  useContext,
  useEffect,
} from 'react'
import { AnnouncementsContext } from './AnnouncementsContext'

/**
 * Responsible for launching announcements. This component may be instantiated in multiple places in the app component tree based on data availability.
 */
export const AnnouncementLauncher: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const wallet = useWallet()
  const { owner } = useContext(V1ProjectContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const isProjectOwner = useIsUserAddress(owner ?? projectOwnerAddress)
  const router = useRouter()

  const { setActiveId } = useContext(AnnouncementsContext)

  const shouldActivateAnnouncement = useCallback(
    (a: Announcement) => {
      // Don't activate if expired
      if (a.expire && a.expire < Date.now().valueOf()) return false

      return a.conditions.every(c => c({ router, isProjectOwner, wallet }))
    },
    [router, isProjectOwner, wallet],
  )

  // Try activating any announcements
  useEffect(() => {
    startTransition(() => {
      // Activate first announcement that fits conditions
      setActiveId(Announcements.find(shouldActivateAnnouncement)?.id)
    })
  }, [shouldActivateAnnouncement, setActiveId])

  return <>{children}</>
}
