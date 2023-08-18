import { getCompleted } from 'components/announcements/Announcement'
import { Announcements } from 'constants/announcements'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useWallet } from 'hooks/Wallet'
import { useIsUserAddress } from 'hooks/useIsUserAddress'
import { Announcement } from 'models/announcement'
import { useRouter } from 'next/router'
import {
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AnnouncementsContext } from './AnnouncementsContext'

export const AnnouncementsProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const [activeId, setActiveId] = useState<string>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const wallet = useWallet()
  const { owner } = useContext(V1ProjectContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const isProjectOwner = useIsUserAddress(owner ?? projectOwnerAddress)
  const router = useRouter()

  const activeAnnouncement = useMemo(
    () => Announcements.find(a => a.id === activeId),
    [activeId],
  )

  const trySetActiveId = useCallback(
    (id: string | undefined) => {
      // Ensure we don't overwrite an activeId
      if (activeId || !id) return

      // Don't activate after having been completed
      if (getCompleted()[id]) return false

      setActiveId(id)
      setModalOpen(true)
    },
    [activeId, setActiveId, setModalOpen],
  )

  const shouldActivateAnnouncement = useCallback(
    (a: Announcement) => {
      // Don't activate if expired
      if (a.expire && a.expire < Date.now().valueOf()) return false

      return a.conditions.every(c => c({ router, isProjectOwner, wallet }))
    },
    [isProjectOwner, wallet, router],
  )

  // Try activating any announcements
  useEffect(() => {
    startTransition(() => {
      // Activate first announcement that fits conditions
      trySetActiveId(Announcements.find(shouldActivateAnnouncement)?.id)
    })
  }, [shouldActivateAnnouncement, setActiveId, trySetActiveId])

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
