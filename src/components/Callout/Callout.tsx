import {
  ChevronDownIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid'
import { PropsWithChildren, useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'
import { InfoCallout } from './InfoCallout'
import { WarningCallout } from './WarningCallout'

type CalloutProps = PropsWithChildren<{
  className?: string
  iconComponent?: JSX.Element | null
  collapsible?: boolean
}>

interface CalloutTypes {
  Info: typeof InfoCallout
  Warning: typeof WarningCallout
}

export const Callout: React.FC<React.PropsWithChildren<CalloutProps>> &
  CalloutTypes = ({
  className,
  children,
  iconComponent,
  collapsible = false,
}: CalloutProps) => {
  // Whether the callout is collapsed. Only relevant if collapsible is true.
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <div
      className={twMerge(
        'flex items-start gap-4 rounded-lg p-4',
        collapsible ? 'cursor-pointer select-none' : undefined,
        className,
      )}
      onClick={collapsible ? () => setExpanded(!expanded) : undefined}
      role={collapsible ? 'button' : undefined}
    >
      {iconComponent !== null && (
        <span className="flex">
          {iconComponent ?? <InformationCircleIcon className="h-7 w-7" />}
        </span>
      )}
      <div
        className={twMerge(
          'inline-block flex-1 overflow-hidden overflow-ellipsis',
          collapsible && !expanded ? 'whitespace-nowrap' : 'whitespace-normal',
        )}
      >
        {children}
      </div>
      {collapsible && (
        <div className="ml-auto">
          <ChevronDownIcon
            className={twJoin('h-5 w-5', expanded ? 'rotate-180' : '')}
          />
        </div>
      )}
    </div>
  )
}

Callout.Info = InfoCallout
Callout.Warning = WarningCallout
