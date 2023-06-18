import { ModalOnCancelFn, ModalOnOkFn } from 'components/modals/JuiceModal'
import { createRoot } from 'react-dom/client'
import { ConfirmationDeletionModal } from '../components/ui/ConfirmationDeletionModal'

export const emitConfirmationDeletionModal = (
  deletionTypeName: string,
  deletionDescription: string,
  onConfirm: () => void,
) => {
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

  root.render(
    <ConfirmationDeletionModal
      initialOpenState={true}
      title={deletionTypeName}
      description={deletionDescription}
      onOk={handleOk}
      onCancel={handleCancel}
    />,
  )
}
