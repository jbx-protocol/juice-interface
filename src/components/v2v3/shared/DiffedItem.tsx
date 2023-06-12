import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { twJoin } from 'tailwind-merge'

export const DIFF_OLD_BACKGROUND = 'bg-error-100 dark:bg-error-900 rounded-sm'
export const DIFF_NEW_BACKGROUND = 'bg-melon-100 dark:bg-melon-900 rounded-sm'

// whether this value the old value or a new (updated) value
type DiffStatus = 'new' | 'old'

const diffIconsMargins = 'ml-1 mr-2'

export function DiffPlus() {
  const className = twJoin(
    'text-melon-700 dark:text-melon-300',
    diffIconsMargins,
  )
  return (
    <span className={className}>
      <PlusCircleIcon className="h-5 w-5" />
    </span>
  )
}

export function DiffMinus() {
  const className = twJoin(
    'text-error-500 dark:text-error-200',
    diffIconsMargins,
  )
  return (
    <span className={className}>
      <MinusCircleIcon className="h-5 w-5" />
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
    <div
      className={twJoin(
        'text-primary ml-2 flex items-center whitespace-nowrap pr-1',
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
  )
}
