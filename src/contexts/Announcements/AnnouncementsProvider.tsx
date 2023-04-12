import { Announcements } from 'constants/announcements'
import { useMemo, useState } from 'react'

import { getCompleted } from 'components/announcements/Announcement'
import { AnnouncementsContext } from './AnnouncementsContext'

export const AnnouncementsProvider: React.FC = ({ children }) => {
  const [activeId, setActiveId] = useState<string>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const activeAnnouncement = useMemo(
    () => Announcements.find(a => a.id === activeId),
    [activeId],
  )

  function trySetActiveId(id: string | undefined) {
    // Ensure we don't overwrite an activeId
    if (activeId || !id) return

    // Don't activate after having been completed
    if (getCompleted()[id]) return false

    setActiveId(id)
    setModalOpen(true)
  }

  return (
    <AnnouncementsContext.Provider
      value={{ activeId, setActiveId: trySetActiveId }}
    >
      {children}
      {activeAnnouncement && (
        <activeAnnouncement.Content open={modalOpen} setOpen={setModalOpen} />
      )}
    </AnnouncementsContext.Provider>
  )
}
