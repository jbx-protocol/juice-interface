import { Menu } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export const MobileMenuButton = ({
  className,
  open,
}: {
  className?: string
  open: boolean
}) => (
  <Menu.Button className={className} as="div">
    {open ? (
      <XMarkIcon className="text-primary h-9 w-9 leading-none" role="button" />
    ) : (
      <Bars3Icon className="text-primary h-9 w-9 leading-none" role="button" />
    )}
  </Menu.Button>
)
