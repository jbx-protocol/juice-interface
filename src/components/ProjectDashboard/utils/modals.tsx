import { t } from '@lingui/macro'
import { ModalOnCancelFn, ModalOnOkFn } from 'components/modals/JuiceModal'
import { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfirmationDeletionModal } from '../components/ui/ConfirmationDeletionModal'

export const emitConfirmationDeletionModal = ({
  type,
  description,
  onConfirm,
}: {
  type: string
  description?: ReactNode
  onConfirm: () => void
}) => {
  const modalRoot = document.createElement('div')
  const root = createRoot(modalRoot)
  document.body.appendChild(modalRoot)
  function cleanup() {
    root.unmount()
    document.body.removeChild(modalRoot)
  }
  const handleOk: ModalOnOkFn = setOpen => {
    onConfirm()
    setOpen(false)
    setTimeout(() => {
      cleanup()
    }, 500)
  }
  const handleCancel: ModalOnCancelFn = setOpen => {
    setOpen(false)
    setTimeout(() => {
      cleanup()
    }, 500)
  }

  const title = t`Are you sure you want to remove ${type}?`

  root.render(
    <ConfirmationDeletionModal
      initialOpenState={true}
      title={title}
      description={description}
      onOk={handleOk}
      onCancel={handleCancel}
    />,
  )
}

/**
 * Curried function that emits a confirmation deletion modal.
 */
export const handleConfirmationDeletion =
  (props: { type: string; description?: ReactNode; onConfirm: () => void }) =>
  () =>
    emitConfirmationDeletionModal(props)
