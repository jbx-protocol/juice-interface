import { Trans } from '@lingui/macro'
import { ModalOnCancelFn, ModalOnOkFn } from 'components/modals/JuiceModal'
import { LanguageProvider } from 'contexts/Language/LanguageProvider'
import { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfirmationDeletionModal } from '../components/ui/ConfirmationDeletionModal'

type EmitConfirmationDeletionModalProps = {
  description?: ReactNode
  okText?: ReactNode
  cancelText?: ReactNode
  onConfirm: () => void
} & (
  | {
      type?: string
    }
  | {
      title?: ReactNode
    }
)

export const emitConfirmationDeletionModal = ({
  description,
  okText,
  cancelText,
  onConfirm,
  ...props
}: EmitConfirmationDeletionModalProps) => {
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

  const title = (() => {
    if ('title' in props) return props.title
    if ('type' in props) {
      return <Trans>Are you sure you want to remove {props.type}?</Trans>
    }
    return <Trans>Are you sure?</Trans>
  })()

  root.render(
    <LanguageProvider>
      <ConfirmationDeletionModal
        initialOpenState={true}
        title={title}
        description={description}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
      />
    </LanguageProvider>,
  )
}

/**
 * Curried function that emits a confirmation deletion modal.
 */
export const handleConfirmationDeletion =
  (props: { type: string; description?: ReactNode; onConfirm: () => void }) =>
  () =>
    emitConfirmationDeletionModal(props)
