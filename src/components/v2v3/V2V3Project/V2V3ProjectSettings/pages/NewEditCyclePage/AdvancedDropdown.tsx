import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import React, { ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function AdvancedDropdown({
  children,
  hideDivider,
  title = <Trans>Advanced</Trans>,
}: React.PropsWithChildren<{ hideDivider?: boolean; title?: ReactNode }>) {
  const [isOpen, setIsOpen] = useState(false)
  const iconClass = 'h-4 w-4'
  return (
    <div
      className={twMerge(
        'border-t border-grey-300 pt-4 dark:border-grey-600',
        hideDivider ? 'border-0' : null,
      )}
    >
      <div
        className="flex cursor-pointer justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-primary font-medium">{title}</span>
        {isOpen ? (
          <ChevronUpIcon className={iconClass} />
        ) : (
          <ChevronDownIcon className={iconClass} />
        )}
      </div>
      {isOpen && <div className="flex flex-col gap-2 pt-8">{children}</div>}
    </div>
  )
}
