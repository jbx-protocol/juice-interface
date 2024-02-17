import { Popover } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export const MobileMenuButton = ({
  className,
  open,
}: {
  className?: string
  open: boolean
}) => (
  <Popover.Button
    className={className}
    as="div"
    role="button"
    aria-label="menu button"
  >
    <>
      {open ? (
        <XMarkIcon
          className="text-primary h-9 w-9 leading-none"
          role="button"
        />
      ) : (
        <Bars3Icon
          className="text-primary h-9 w-9 leading-none"
          role="button"
        />
      )}
    </>
  </Popover.Button>
)
