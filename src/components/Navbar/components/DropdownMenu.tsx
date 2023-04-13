import { DownOutlined } from '@ant-design/icons'
import { Menu, Transition } from '@headlessui/react'
import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'
import { Fragment } from 'react'

export const DropdownMenu = ({
  heading,
  items,
}: {
  heading: string
  items: { label: string; href: string; isExternal?: boolean }[]
}) => {
  return (
    <Menu>
      <div className="md:relative">
        <Menu.Button
          as="div"
          className={
            'text-primary flex cursor-pointer items-center justify-between font-medium hover:text-grey-500 dark:hover:text-slate-200 md:gap-1'
          }
        >
          {heading}
          <DownOutlined />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={
              'flex flex-col gap-4 px-6 pt-4 dark:bg-slate-800 md:absolute md:left-0 md:z-10 md:mt-2 md:gap-5 md:rounded-lg md:border md:border-grey-300 md:bg-white md:px-2.5 md:py-4 md:dark:border-slate-300'
            }
          >
            {items.map(item => (
              <Menu.Item key={item.href}>
                {item.isExternal ? (
                  <ExternalLink
                    className="text-primary md:whitespace-nowrap md:font-medium"
                    href={item.href}
                  >
                    {item.label}
                  </ExternalLink>
                ) : (
                  <Link href={item.href}>
                    <a className="text-primary md:whitespace-nowrap md:font-medium">
                      {item.label}
                    </a>
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  )
}
