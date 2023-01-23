import { twJoin } from 'tailwind-merge'

export const DIFF_OLD_BACKGROUND = 'bg-error-200 dark:bg-error-800'
export const DIFF_NEW_BACKGROUND = 'bg-success-200 dark:bg-success-800'

// whether this value the old value or a new (updated) value
type DiffStatus = 'new' | 'old'

const diffIconsMargins = 'ml-1 mr-2'

export function DiffPlus() {
  const className = twJoin(
    'text-success-500 dark:text-success-200',
    diffIconsMargins,
  )
  return <span className={className}>+</span>
}

export function DiffMinus() {
  const className = twJoin(
    'text-error-500 dark:text-error-200',
    diffIconsMargins,
  )
  return <span className={className}>-</span>
}

export function DiffedItem({
  value,
  diffStatus,
}: {
  value: string | JSX.Element
  diffStatus: DiffStatus | undefined
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
        'text-primary ml-2 flex whitespace-nowrap pr-1',
        highlight,
      )}
    >
      {diffStatus === 'new' ? (
        <DiffPlus />
      ) : diffStatus === 'old' ? (
        <DiffMinus />
      ) : null}
      {value}
    </div>
  )
}
