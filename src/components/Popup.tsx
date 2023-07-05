import { Dialog, Transition } from '@headlessui/react'
import { Fragment, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

/**
 * Popup component that renders a modal window with a mask, transitions, and user-provided content.
 *
 * @module Popup
 * @param {Object} props - Properties passed to the Popup component.
 * @param {ReactNode} props.children - The content to be rendered inside the Popup.
 * @param {boolean} props.open - A boolean value indicating whether the Popup should be open or not.
 * @param {(open: boolean) => void} props.setOpen - A function to update the `open` state of the Popup.
 * @param {((setOpen: (open: boolean) => void) => void)?} [props.onMaskClick] - An optional function to handle the mask click event.
 * @returns {ReactElement} The rendered Popup component.
 */
export const Popup = ({
  id,
  as,
  children,
  open,
  setOpen,
  onMaskClick: _onMaskClick,
  className,
  maskClassName,
}: PropsWithChildren<{
  as?: React.ElementType
  className?: string
  maskClassName?: string
  id?: string
  open: boolean
  setOpen: (open: boolean) => void
  onMaskClick?: (setOpen: (open: boolean) => void) => void
}>) => {
  const onClose = () => setOpen(false)
  const onMaskClick = _onMaskClick ? () => _onMaskClick(setOpen) : onClose
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        id={id}
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div
          className={twMerge(
            'relative min-h-screen px-4 pt-4 pb-20 text-center sm:block',
            className,
          )}
        >
          <PopupMask className={maskClassName} onClick={onMaskClick} />

          <Transition.Child
            as={as ?? Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {children}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

const PopupMask = ({
  className,
  onClick,
}: {
  className?: string
  onClick?: VoidFunction
}) => (
  <div
    className={twMerge(
      'fixed inset-0 bg-black bg-opacity-50 transition-opacity',
      className,
    )}
    aria-hidden="true"
    onClick={onClick}
  />
)
