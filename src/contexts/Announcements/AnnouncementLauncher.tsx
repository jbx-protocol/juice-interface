import { announcements } from 'constants/announcements'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { Announcement } from 'models/announcement'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'

import { AnnouncementsContext } from './AnnouncementsContext'

/**
 * Responsible for launching announcements. This component may be instantiated in multiple places in the app component tree based on data availability.
 */
export const AnnouncementLauncher: React.FC = ({ children }) => {
  const announcementsEnabled = featureFlagEnabled(FEATURE_FLAGS.ANNOUNCEMENTS)

  const { owner } = useContext(V1ProjectContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const isProjectOwner = useIsUserAddress(owner ?? projectOwnerAddress)
  const router = useRouter()

  const { setActiveId } = useContext(AnnouncementsContext)

  const shouldActivateAnnouncement = useCallback(
    (a: Announcement) => {
      // Don't activate if expired
      if (a.expire && a.expire > Date.now().valueOf()) return false

      return a.conditions.every(c => c({ router, isProjectOwner }))
    },
    [router, isProjectOwner],
  )

  // Try activating any announcements
  useEffect(() => {
    if (!announcementsEnabled || !setActiveId) return

    // Activate first announcement that fits conditions
    setActiveId(announcements.find(shouldActivateAnnouncement)?.id)
  }, [shouldActivateAnnouncement, announcementsEnabled, setActiveId])

  return <>{children}</>
}
