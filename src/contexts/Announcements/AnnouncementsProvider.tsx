import { t } from '@lingui/macro'
import Modal from 'antd/lib/modal/Modal'
import { announcements } from 'constants/announcements'
import { readNetwork } from 'constants/networks'
import useMobile from 'hooks/Mobile'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'

import { AnnouncementsContext } from './AnnouncementsContext'

const ANNOUNCEMENTS_STORAGE_KEY = `${readNetwork.chainId}_announcements_completed`

function getCompleted() {
  const content = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY)
  return (content ? JSON.parse(content) : {}) as { [k: string]: true }
}

export const AnnouncementsProvider: React.FC = ({ children }) => {
  const [activeId, setActiveId] = useState<string>()

  const router = useRouter()

  const isMobile = useMobile()

  // Store record of completed announcement in localStorage
  const markCompleted = useCallback(() => {
    if (!activeId) return

    localStorage.setItem(
      ANNOUNCEMENTS_STORAGE_KEY,
      JSON.stringify({ ...getCompleted(), [activeId]: true }),
    )

    setActiveId(undefined)
  }, [activeId])

  const activeAnnouncement = useMemo(
    () => announcements.find(a => a.id === activeId),
    [activeId],
  )

  function trySetActiveId(id: string | undefined) {
    // Ensure we don't overwrite an activeId
    if (activeId || !id) return

    // Don't activate after having been completed
    if (getCompleted()[id]) return false

    setActiveId(id)
  }

  return (
    <AnnouncementsContext.Provider value={{ setActiveId: trySetActiveId }}>
      {children}
      {activeAnnouncement && (
        <Modal
          centered={isMobile}
          maskClosable={false} // Force user to click OK instead of mask
          style={
            isMobile ? undefined : { position: 'absolute', right: 30, top: 30 }
          }
          open={true}
          okText={activeAnnouncement.cta?.text ?? t`Got it`}
          onOk={() => {
            markCompleted()
            activeAnnouncement.cta?.fn?.(router)
          }}
          cancelText={t`Got it`}
          onCancel={markCompleted}
          cancelButtonProps={{
            // We only show the cancel button if there is a custom `cta.fn` defined in the announcement. The cancel button will allow closing the announcement without calling the cta function
            hidden: !activeAnnouncement.cta?.fn,
          }}
        >
          <activeAnnouncement.content />
        </Modal>
      )}
    </AnnouncementsContext.Provider>
  )
}
