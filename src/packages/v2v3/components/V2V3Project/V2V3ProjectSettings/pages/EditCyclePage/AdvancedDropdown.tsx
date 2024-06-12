import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import React, { ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function AdvancedDropdown({
  children,
  hideDivider,
  className,
  headerClassName,
  contentContainerClass,
  title = <Trans>Advanced</Trans>,
}: React.PropsWithChildren<{
  hideDivider?: boolean
  title?: ReactNode
  className?: string
  headerClassName?: string
  contentContainerClass?: string
}>) {
  const [isOpen, setIsOpen] = useState(false)
  const iconClass = 'h-4 w-4'
  return (
    <div
      className={twMerge(
        'border-t border-grey-300 pt-4 dark:border-slate-600',
        hideDivider ? 'border-0' : null,
        className,
      )}
    >
      <div
        className={twMerge(
          'flex cursor-pointer items-center justify-between',
          headerClassName,
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-primary font-medium">{title}</span>
        {isOpen ? (
          <ChevronUpIcon className={iconClass} />
        ) : (
          <ChevronDownIcon className={iconClass} />
        )}
      </div>
      {isOpen && (
        <div
          className={twMerge('flex flex-col gap-2 pt-8', contentContainerClass)}
        >
          {children}
        </div>
      )}
    </div>
  )
}
