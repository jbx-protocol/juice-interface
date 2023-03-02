import { t } from '@lingui/macro'
import Modal from 'antd/lib/modal/Modal'
import { announcements } from 'constants/announcements'
import { readNetwork } from 'constants/networks'
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
          centered
          open={true}
          okText={activeAnnouncement.action?.text ?? t`Got it`}
          onOk={() => {
            markCompleted()
            activeAnnouncement.action?.call?.(router)
          }}
          cancelText={t`Got it`}
          onCancel={markCompleted}
          cancelButtonProps={activeAnnouncement.action ? {} : { hidden: true }}
        >
          {activeAnnouncement.content}
        </Modal>
      )}
    </AnnouncementsContext.Provider>
  )
}
