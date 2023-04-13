import { MenuOutlined } from '@ant-design/icons'
import { Menu } from '@headlessui/react'

export const HamburgerMenuButton = ({ className }: { className?: string }) => (
  <Menu.Button className={className} as="div">
    <MenuOutlined
      className="text-2xl leading-none text-black dark:text-slate-100"
      role="button"
    />
  </Menu.Button>
)
