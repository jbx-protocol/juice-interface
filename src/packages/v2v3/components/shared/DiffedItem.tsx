import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { twJoin } from 'tailwind-merge'

export const DIFF_OLD_BACKGROUND = 'bg-error-100 dark:bg-error-950'
export const DIFF_NEW_BACKGROUND = 'bg-melon-100 dark:bg-melon-950'

// whether this value the old value or a new (updated) value
type DiffStatus = 'new' | 'old'

const diffIconsMargins = 'mr-2'
const iconsStrokeWidth = 2

export function DiffPlus() {
  const className = twJoin(
    'text-melon-700 dark:text-melon-400',
    diffIconsMargins,
  )
  return (
    <span className={className}>
      <PlusCircleIcon className="h-4 w-4" strokeWidth={iconsStrokeWidth} />
    </span>
  )
}

export function DiffMinus() {
  const className = twJoin(
    'text-error-500 dark:text-error-400',
    diffIconsMargins,
  )
  return (
    <span className={className}>
      <MinusCircleIcon className="h-4 w-4" strokeWidth={iconsStrokeWidth} />
    </span>
  )
}

export function DiffedItem({
  value,
  diffStatus,
  hideIcon,
}: {
  value: string | JSX.Element
  diffStatus: DiffStatus | undefined
  hideIcon?: boolean
}) {
  const highlight =
    diffStatus === 'old'
      ? DIFF_OLD_BACKGROUND
      : diffStatus === 'new'
      ? DIFF_NEW_BACKGROUND
      : undefined

  return (
    <Tooltip
      title={
        diffStatus === 'old' ? (
          <Trans>Previous value</Trans>
        ) : diffStatus === 'new' ? (
          <Trans>New value</Trans>
        ) : undefined
      }
    >
      <div
        className={twJoin(
          'text-primary ml-2 flex items-center whitespace-nowrap rounded-md py-1 pl-3 pr-4',
          highlight,
        )}
      >
        {hideIcon ? null : (
          <>
            {diffStatus === 'new' ? (
              <DiffPlus />
            ) : diffStatus === 'old' ? (
              <DiffMinus />
            ) : null}
          </>
        )}
        {value}
      </div>
    </Tooltip>
  )
}
