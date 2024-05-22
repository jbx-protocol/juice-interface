import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { Button } from 'antd'
import useMobile from 'hooks/useMobile'
import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { Popup } from '../Popup'

type ModalSetOpenFn = (open: boolean) => void

export type ModalOnOkFn = (setOpen: ModalSetOpenFn) => void
export type ModalOnCancelFn = (setOpen: ModalSetOpenFn) => void

export type JuiceModalProps = {
  className?: string
  id?: string
  title?: ReactNode
  position?:
    | 'top'
    | 'topRight'
    | 'right'
    | 'bottomRight'
    | 'bottom'
    | 'bottomLeft'
    | 'left'
    | 'topLeft'
    | 'center'
  buttonPosition?: 'right' | 'stretch'
  open: boolean
  okButtonForm?: string
  okText?: ReactNode
  okButtonClassName?: string
  hideOkButton?: boolean
  okLoading?: boolean
  cancelText?: ReactNode
  cancelButtonClassName?: string
  hideCancelButton?: boolean
  setOpen: ModalSetOpenFn
  onCancel?: ModalOnCancelFn
} & (
  | {
      onOk?: ModalOnOkFn
    }
  | {
      onSubmit?: VoidFunction
    }
)

export const JuiceModal = ({
  className,
  id,
  children,
  title,
  position = 'top',
  buttonPosition = 'right',
  open,
  okButtonForm,
  okText = t`OK`,
  okLoading = false,
  okButtonClassName,
  hideOkButton,
  cancelText = t`Cancel`,
  cancelButtonClassName,
  hideCancelButton,
  setOpen,
  onCancel: _onCancel,
  ...rest
}: PropsWithChildren<JuiceModalProps>) => {
  const isMobile = useMobile()
  const closeModal = () => setOpen(false)
  let onOk: VoidFunction | undefined
  let onSubmit: VoidFunction | undefined
  if ('onSubmit' in rest && rest.onSubmit) {
    onSubmit = rest.onSubmit
    onOk = undefined
  } else if ('onOk' in rest && rest.onOk) {
    onOk = () => rest.onOk!(setOpen)
  } else {
    onOk = closeModal
  }

  const onCancel = _onCancel ? () => _onCancel(setOpen) : closeModal

  const positionClasses = useMemo(() => {
    if (isMobile) return undefined // Mobile position doesn't use absolute positioning
    switch (position) {
      case 'top':
        return 'md:top-8 md:-translate-x-1/2 md:left-1/2'
      case 'topRight':
        return 'md:top-8 md:right-8'
      case 'right':
        return 'md:top-1/2 md:right-8 md:-translate-y-1/2'
      case 'bottomRight':
        return 'md:bottom-8 md:right-8'
      case 'bottom':
        return 'md:bottom-8 md:-translate-x-1/2 md:left-1/2'
      case 'bottomLeft':
        return 'md:bottom-8 md:left-8'
      case 'left':
        return 'md:top-1/2 md:left-8 md:-translate-y-1/2'
      case 'topLeft':
        return 'md:top-8 md:left-8'
      case 'center':
        return 'md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2'
    }
  }, [isMobile, position])

  const buttonPositionClasses = useMemo(() => {
    switch (buttonPosition) {
      case 'right':
        return { container: 'justify-end', self: '' }
      case 'stretch':
        return { container: '', self: 'w-full' }
    }
  }, [buttonPosition])

  return (
    <Popup id={id} open={open} setOpen={setOpen} onMaskClick={onCancel}>
      <form
        onSubmit={onSubmit}
        className={twMerge(
          'relative mx-auto mt-10 w-full max-w-md overflow-hidden rounded-lg bg-smoke-25 p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800 md:absolute',
          positionClasses ? positionClasses : '',
          className,
        )}
      >
        <div className="relative">
          <Dialog.Title as="h3" className="text-lg font-medium leading-6">
            {title}
          </Dialog.Title>
          <div className="mt-4">{children}</div>

          <div className="mt-4">
            <div
              className={twMerge(
                'flex w-full items-center gap-2',
                buttonPositionClasses.container,
              )}
            >
              {!hideOkButton && (
                <CTAButton
                  form={okButtonForm}
                  className={twMerge(
                    'order-2',
                    buttonPositionClasses.self,
                    okButtonClassName,
                  )}
                  loading={okLoading}
                  onClick={onOk}
                >
                  {okText}
                </CTAButton>
              )}
              {!hideCancelButton && (
                <CancelButton
                  className={twMerge(
                    'order-1',
                    buttonPositionClasses.self,
                    cancelButtonClassName,
                  )}
                  onClick={onCancel}
                >
                  {cancelText}
                </CancelButton>
              )}
            </div>
            <ExitButton
              className="absolute -top-2 -right-2"
              onClick={onCancel}
            />
          </div>
        </div>
      </form>
    </Popup>
  )
}

const CTAButton = ({
  className,
  loading,
  form,
  onClick,
  children,
}: PropsWithChildren<{
  loading: boolean
  className?: string
  form?: string
  onClick?: VoidFunction
}>) => (
  <Button
    type="primary"
    htmlType={form ? 'submit' : 'button'}
    loading={loading}
    className={twMerge(
      loading ? 'cursor-not-allowed opacity-50' : '',
      className,
    )}
    onClick={onClick}
  >
    {children}
  </Button>
)

const CancelButton = ({
  children,
  className,
  onClick,
}: PropsWithChildren<{
  className?: string
  onClick?: VoidFunction
}>) => (
  <Button className={className} onClick={onClick}>
    {children}
  </Button>
)

const ExitButton = ({
  className,
  onClick,
}: {
  className?: string
  onClick?: VoidFunction
}) => (
  <button
    id="modal-exit-button"
    type="button"
    className={twMerge(
      'inline-flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-1 hover:bg-smoke-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      className,
    )}
    onClick={onClick}
  >
    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
  </button>
)
