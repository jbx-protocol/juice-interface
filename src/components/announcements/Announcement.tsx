import {
  JuiceModal,
  JuiceModalProps,
  ModalOnCancelFn,
  ModalOnOkFn,
} from 'components/modals/JuiceModal'
import { readNetwork } from 'constants/networks'
import { AnnouncementsContext } from 'contexts/Announcements/AnnouncementsContext'
import { useCallback, useContext } from 'react'

const ANNOUNCEMENTS_STORAGE_KEY = `${readNetwork.chainId}_announcements_completed`

export function getCompleted() {
  const content = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY)
  return (content ? JSON.parse(content) : {}) as { [k: string]: true }
}

export const Announcement: React.FC<
  React.PropsWithChildren<JuiceModalProps>
> = props => {
  const { activeId, setActiveId } = useContext(AnnouncementsContext)

  const markCompleted = useCallback(() => {
    if (!activeId) return

    localStorage.setItem(
      ANNOUNCEMENTS_STORAGE_KEY,
      JSON.stringify({ ...getCompleted(), [activeId]: true }),
    )
  }, [activeId])

  const onOk: ModalOnOkFn = useCallback(
    async setOpen => {
      markCompleted()
      setActiveId(undefined)
      // Await is required if these props use async functions
      await props.onOk?.(setOpen)
      setOpen(false)
    },
    [markCompleted, props, setActiveId],
  )

  const onCancel: ModalOnCancelFn = useCallback(
    setOpen => {
      markCompleted()
      setActiveId(undefined)
      props.onCancel?.(setOpen)
      setOpen(false)
    },
    [markCompleted, props, setActiveId],
  )

  return (
    <JuiceModal
      {...props}
      id={props.id ?? 'announcement-modal'}
      onOk={onOk}
      onCancel={onCancel}
    >
      {props.children}
    </JuiceModal>
  )
}
