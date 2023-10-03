import {
  JuiceModal,
  ModalOnCancelFn,
  ModalOnOkFn,
} from 'components/modals/JuiceModal'
import { ReactNode, useState } from 'react'

export const ConfirmationDeletionModal = ({
  initialOpenState = false,
  title,
  description,
  okText,
  cancelText,
  onOk,
  onCancel,
}: {
  initialOpenState?: boolean
  title: ReactNode
  description?: ReactNode
  okText?: ReactNode
  cancelText?: ReactNode
  onOk?: ModalOnOkFn
  onCancel?: ModalOnCancelFn
}) => {
  const [open, setOpen] = useState(initialOpenState)
  return (
    <JuiceModal
      position="center"
      title={title}
      className="max-w-sm"
      buttonPosition="stretch"
      okText={okText ?? 'Remove'}
      cancelText={cancelText ?? 'Cancel'}
      okButtonClassName="bg-error-600 hover:bg-error-700 border-error-600 text-white"
      cancelButtonClassName="border-grey-300 text-grey-700 hover:border-grey-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
      open={open}
      setOpen={setOpen}
      onOk={onOk}
      onCancel={onCancel}
    >
      <span className="text-sm text-grey-500 dark:text-slate-200">
        {description}
      </span>
    </JuiceModal>
  )
}
