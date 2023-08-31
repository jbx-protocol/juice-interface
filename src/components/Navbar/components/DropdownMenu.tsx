import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import PatchedExternalLink from 'components/fixes/PatchedExternalLink'
import PatchedNextLink from 'components/fixes/PatchedNextLink'
import useMobile from 'hooks/useMobile'
import { Fragment, MouseEventHandler, ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type ComponentItem = {
  id: string
  component: ReactNode
}

type LinkItem = {
  id: string
  label: ReactNode
  href: string
  locale?: string
  isExternal?: boolean
}

type ButtonItem = {
  id: string
  label: ReactNode
  onClick: MouseEventHandler
}

export type DropdownMenuItem = LinkItem | ButtonItem | ComponentItem

function isLinkItem(item: DropdownMenuItem): item is LinkItem {
  return (item as LinkItem).href !== undefined
}

function isButtonItem(item: DropdownMenuItem): item is ButtonItem {
  return (item as ButtonItem).onClick !== undefined
}

export const DropdownMenu = ({
  className,
  dropdownClassName,
  heading,
  items,
  hideArrow = false,
  disableHover = false,
}: {
  className?: string
  dropdownClassName?: string
  heading: ReactNode
  items: DropdownMenuItem[]
  hideArrow?: boolean
  disableHover?: boolean
}) => {
  const isMobile = useMobile()
  const [hovering, setHovering] = useState(false)
  const timeoutDuration = 200
  let timeout: ReturnType<typeof setTimeout>

  const onMouseEnter = () => {
    clearTimeout(timeout)
    setHovering(true)
  }

  const onMouseLeave = () => {
    timeout = setTimeout(() => {
      setHovering(false)
    }, timeoutDuration)
  }

  return (
    <Menu
      as="div"
      className={twMerge('w-full md:relative md:w-fit', className)}
    >
      {({ open }) => (
        <>
          <Menu.Button
            as="div"
            className={
              'text-primary flex w-full cursor-pointer items-center justify-between font-medium dark:hover:text-slate-200 md:gap-1'
            }
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {({ open }) => (
              <>
                <div className="text-primary flex w-full items-center justify-between gap-1 font-medium hover:text-bluebs-500 dark:hover:text-bluebs-300 md:justify-start md:text-sm">
                  {heading}
                  {!hideArrow && (
                    <ChevronDownIcon
                      className={twMerge(
                        'h-5 w-5 transition-transform duration-200',
                        open ? 'rotate-180' : '',
                      )}
                    />
                  )}
                </div>
              </>
            )}
          </Menu.Button>

          <Transition
            show={open || (!disableHover && hovering && !isMobile)}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className={twMerge(
                'flex flex-col gap-4 pt-4 outline-none dark:bg-slate-800',
                'md:absolute md:left-0 md:z-10 md:mt-2 md:w-52 md:gap-0 md:rounded-lg md:border md:border-grey-300 md:bg-white md:pt-0 md:dark:border-slate-300',
                dropdownClassName,
              )}
            >
              {items.map(item => (
                <Menu.Item key={item.id}>
                  {isLinkItem(item) ? (
                    item.isExternal ? (
                      <PatchedExternalLink
                        className="text-primary px-4 first:rounded-t-lg last:rounded-b-lg hover:bg-grey-100 dark:hover:bg-slate-600 md:whitespace-nowrap md:py-2.5 md:font-medium md:first:pt-3.5 md:last:pb-3.5"
                        href={item.href}
                      >
                        {item.label}
                      </PatchedExternalLink>
                    ) : (
                      <PatchedNextLink
                        className="text-primary px-4 first:rounded-t-lg last:rounded-b-lg hover:bg-grey-100 dark:hover:bg-slate-600 md:whitespace-nowrap md:py-2.5 md:font-medium md:first:pt-3.5 md:last:pb-3.5"
                        href={item.href}
                        locale={item.locale ?? undefined}
                      >
                        {item.label}
                      </PatchedNextLink>
                    )
                  ) : isButtonItem(item) ? (
                    <div
                      className="text-primary cursor-pointer  px-4 first:rounded-t-lg last:rounded-b-lg hover:bg-grey-100 hover:text-bluebs-500 dark:hover:bg-slate-600 md:whitespace-nowrap md:py-2.5 md:font-medium md:first:pt-3.5 md:last:pb-3.5"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </div>
                  ) : (
                    item.component
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
