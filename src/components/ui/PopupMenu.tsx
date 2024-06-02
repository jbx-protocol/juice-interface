import { Menu } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import PatchedExternalLink from 'components/fixes/PatchedExternalLink'
import PatchedNextLink from 'components/fixes/PatchedNextLink'
import { MouseEventHandler, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type ComponentItem = {
  id: string
  component: ReactNode
}

type LinkItem = {
  id: string
  label: ReactNode
  href: string
  isExternal?: boolean
}

type ButtonItem = {
  id: string
  label: ReactNode
  onClick: MouseEventHandler
}

export type PopupMenuItem = ComponentItem | LinkItem | ButtonItem

export type PopupMenuProps = {
  customButton?: ReactNode
  className?: string
  popupClassName?: string
  menuButtonIconClassName?: string
  items: PopupMenuItem[]
}

function isLinkItem(item: PopupMenuItem): item is LinkItem {
  return (item as LinkItem).href !== undefined
}

function isButtonItem(item: PopupMenuItem): item is ButtonItem {
  return (item as ButtonItem).onClick !== undefined
}

export const PopupMenu = ({
  customButton,
  className,
  popupClassName,
  items,
  menuButtonIconClassName,
}: PopupMenuProps) => {
  return (
    <>
      <Menu
        as="div"
        className={twMerge(
          'relative flex items-center justify-center',
          className,
        )}
      >
        {({ open }) => (
          <>
            <Menu.Button
              className={twMerge(
                open &&
                  !customButton &&
                  'rounded-lg bg-smoke-100 dark:bg-slate-600',
              )}
            >
              {customButton ?? (
                <EllipsisVerticalIcon
                  className={twMerge('h-6 w-6', menuButtonIconClassName)}
                />
              )}
            </Menu.Button>

            <Menu.Items
              as="div"
              className={twMerge(
                `absolute top-7 right-0 z-10 overflow-hidden rounded-lg border border-grey-200 bg-white shadow-md dark:border-slate-500 dark:bg-slate-900`,
                popupClassName,
              )}
            >
              {items.map(item => (
                <Menu.Item key={item.id}>
                  {isLinkItem(item) ? (
                    item.isExternal ? (
                      <PatchedExternalLink className="flex gap-2 p-4 hover:bg-smoke-100 dark:hover:bg-slate-600">
                        {item.label}
                      </PatchedExternalLink>
                    ) : (
                      <PatchedNextLink
                        className="flex gap-2 p-4 hover:bg-smoke-100 dark:hover:bg-slate-600"
                        href={item.href}
                      >
                        {item.label}
                      </PatchedNextLink>
                    )
                  ) : isButtonItem(item) ? (
                    <button
                      className="flex w-full gap-2 p-4 hover:bg-smoke-100 dark:hover:bg-slate-600"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </button>
                  ) : (
                    item.component && (
                      <div className="hover:bg-smoke-100 dark:hover:bg-slate-600">
                        {item.component}
                      </div>
                    )
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </>
        )}
      </Menu>
    </>
  )
}
