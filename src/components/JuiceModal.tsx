import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import useMobile from 'hooks/Mobile'
import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import Loading from './Loading'
import { Popup } from './Popup'

type ModalSetOpenFn = (open: boolean) => void

export type ModalOnOkFn = (setOpen: ModalSetOpenFn) => void
export type ModalOnCancelFn = (setOpen: ModalSetOpenFn) => void

export interface JuiceModalProps {
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
  open: boolean
  okText?: ReactNode
  okLoading?: boolean
  cancelText?: ReactNode
  hideCancelButton?: boolean
  setOpen: ModalSetOpenFn
  onOk?: ModalOnOkFn
  onCancel?: ModalOnCancelFn
}

export const JuiceModal = ({
  children,
  title,
  position = 'top',
  open,
  okText = t`OK`,
  okLoading = false,
  cancelText = t`Cancel`,
  hideCancelButton,
  setOpen,
  onOk: _onOk,
  onCancel: _onCancel,
}: PropsWithChildren<JuiceModalProps>) => {
  const isMobile = useMobile()
  const closeModal = () => setOpen(false)
  const onOk = _onOk ? () => _onOk(setOpen) : closeModal
  const onCancel = _onCancel ? () => _onCancel(setOpen) : closeModal

  const positionClasses = useMemo(() => {
    if (isMobile) return undefined // Mobile position doesn't use absolute positioning
    switch (position) {
      case 'top':
        return 'top-8 -translate-x-1/2 left-1/2'
      case 'topRight':
        return 'top-8 right-8'
      case 'right':
        return 'top-1/2 right-8 -translate-y-1/2'
      case 'bottomRight':
        return 'bottom-8 right-8'
      case 'bottom':
        return 'bottom-8 -translate-x-1/2 left-1/2'
      case 'bottomLeft':
        return 'bottom-8 left-8'
      case 'left':
        return 'top-1/2 left-8 -translate-y-1/2'
      case 'topLeft':
        return 'top-8 left-8'
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
    }
  }, [isMobile, position])

  return (
    <Popup open={open} setOpen={setOpen} onMaskClick={onCancel}>
      <div className={isMobile ? 'relative h-full w-full' : undefined}>
        <div
          className={twMerge(
            'mx-auto mt-10 w-full max-w-md overflow-hidden rounded-lg bg-smoke-25 p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800 md:absolute',
            positionClasses,
          )}
        >
          <div className="relative">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6">
              {title}
            </Dialog.Title>
            <div className="mt-4">{children}</div>

            <div className="mt-4">
              <div className="flex w-full items-center justify-end gap-2">
                {!hideCancelButton && (
                  <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
                )}
                <CTAButton loading={okLoading} onClick={onOk}>
                  {okText}
                </CTAButton>
              </div>
              <ExitButton
                className="absolute -top-2 -right-2"
                onClick={onCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </Popup>
  )
}

const CTAButton = ({
  className,
  loading,
  onClick,
  children,
}: PropsWithChildren<{
  loading: boolean
  className?: string
  onClick?: VoidFunction
}>) => (
  <button
    type="button"
    className={twMerge(
      'inline-flex justify-center rounded-md border border-transparent bg-bluebs-500 px-4 py-2 text-sm font-medium text-white hover:bg-bluebs-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      loading ? 'cursor-not-allowed opacity-50' : '',
      className,
    )}
    onClick={onClick}
  >
    {loading ? <Loading size="small" /> : children}
  </button>
)

const CancelButton = ({
  children,
  className,
  onClick,
}: PropsWithChildren<{
  className?: string
  onClick?: VoidFunction
}>) => (
  <button
    type="button"
    className={twMerge(
      'stroke-secondary inline-flex cursor-pointer justify-center rounded-md border border-solid bg-transparent px-4 py-2 text-sm font-medium outline-none focus:outline-none',
      'hover:border-bluebs-500 hover:bg-bluebs-500/20 hover:text-bluebs-500 dark:hover:border-bluebs-500 dark:hover:bg-bluebs-500/20',
      className,
    )}
    onClick={onClick}
  >
    {children}
  </button>
)

const ExitButton = ({
  className,
  onClick,
}: {
  className?: string
  onClick?: VoidFunction
}) => (
  <button
    type="button"
    className={twMerge(
      'inline-flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      className,
    )}
    onClick={onClick}
  >
    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
  </button>
)
