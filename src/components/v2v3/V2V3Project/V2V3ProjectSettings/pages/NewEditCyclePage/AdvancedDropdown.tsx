import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useState } from 'react'

export function AdvancedDropdown({
  children,
}: React.PropsWithChildren<unknown>) {
  const [isOpen, setIsOpen] = useState(false)
  const iconClass = 'h-4 w-4'
  return (
    <div className="border-t border-grey-300 pt-4 dark:border-grey-600">
      <div
        className="flex cursor-pointer justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-primary font-medium">
          <Trans>Advanced</Trans>
        </span>
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
