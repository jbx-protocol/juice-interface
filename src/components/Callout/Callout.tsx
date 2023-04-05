import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { PropsWithChildren, useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { classNames } from 'utils/classNames'
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

export const Callout: React.FC<CalloutProps> & CalloutTypes = ({
  className,
  children,
  iconComponent,
  collapsible = false,
}: CalloutProps) => {
  // Whether the callout is collapsed. Only relevant if collapsible is true.
  const [expanded, setExpanded] = useState<boolean>(false)

  // react callback handler to expand the callout text
  const handleToggleExpand = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  return (
    <div
      className={twMerge(
        'flex items-start gap-4 rounded-lg p-4',
        collapsible ? 'cursor-pointer select-none' : undefined,
        className,
      )}
      onClick={collapsible ? handleToggleExpand : undefined}
      role={collapsible ? 'button' : undefined}
    >
      {iconComponent !== null && (
        <span className="flex">{iconComponent ?? <InfoCircleOutlined />}</span>
      )}
      <div
        className={classNames(
          'inline-block overflow-hidden overflow-ellipsis',
          collapsible && !expanded ? 'whitespace-nowrap' : 'whitespace-normal',
        )}
      >
        {children}
      </div>
      {collapsible && (
        <DownOutlined className="text-base" rotate={expanded ? 180 : 0} />
      )}
    </div>
  )
}

Callout.Info = InfoCallout
Callout.Warning = WarningCallout
