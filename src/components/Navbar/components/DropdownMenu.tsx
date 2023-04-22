import { DownOutlined } from '@ant-design/icons'
import { Menu, Transition } from '@headlessui/react'
import PatchedExternalLink from 'components/fixes/PatchedExternalLink'
import PatchedNextLink from 'components/fixes/PatchedNextLink'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

export const DropdownMenu = ({
  heading,
  items,
}: {
  heading: string
  items: { label: string; href: string; isExternal?: boolean }[]
}) => {
  return (
    <Menu as="div" className="md:relative">
      <Menu.Button
        as="div"
        className={
          'text-primary flex cursor-pointer items-center justify-between font-medium hover:text-grey-500 dark:hover:text-slate-200 md:gap-1'
        }
      >
        {({ open }) => (
          <>
            <div className="text-primary flex items-center gap-1 text-sm font-medium hover:text-bluebs-500 dark:hover:text-bluebs-300">
              {heading}
              <DownOutlined
                className={twMerge(
                  'transition-transform duration-200',
                  open ? 'rotate-180' : '',
                )}
              />
            </div>
          </>
        )}
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
                <PatchedExternalLink
                  className="text-primary md:whitespace-nowrap md:font-medium"
                  href={item.href}
                >
                  {item.label}
                </PatchedExternalLink>
              ) : (
                <PatchedNextLink
                  className="text-primary md:whitespace-nowrap md:font-medium"
                  href={item.href}
                >
                  {item.label}
                </PatchedNextLink>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
