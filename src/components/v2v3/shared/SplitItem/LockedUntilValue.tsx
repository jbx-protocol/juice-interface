import { formatDate } from 'utils/format/formatDate'
import { LockOutlined } from '@ant-design/icons'
import { DiffedItem } from 'components/v2v3/shared/DiffedItem'
import { Tooltip } from 'antd'
import { Trans } from '@lingui/macro'

function LockedContainer({
  value,
}: {
  value: JSX.Element | string | undefined
}) {
  if (!value) return null
  return (
    <Tooltip
      title={
        <Trans>
          Locked until <strong>{value}</strong>
        </Trans>
      }
      className="h-22px ml-2 flex items-center text-sm text-grey-500 dark:text-grey-300"
    >
      <LockOutlined className="mr-1" /> {value}
    </Tooltip>
  )
}

export function LockedUntilValue({
  lockedUntil,
  oldLockedUntil,
  showDiff,
}: {
  lockedUntil: number | undefined
  oldLockedUntil?: number
  showDiff?: boolean
}) {
  const lockedUntilFormatted = lockedUntil
    ? formatDate(lockedUntil * 1000, 'yyyy-MM-DD')
    : undefined
  const oldLockedUntilFormatted = oldLockedUntil
    ? formatDate(oldLockedUntil * 1000, 'yyyy-MM-DD')
    : undefined

  const hasOldLockedUntil =
    oldLockedUntilFormatted && oldLockedUntil && oldLockedUntil > 0
  const hasNewLockedUntil = lockedUntil && lockedUntil > 0
  const hasDiff = showDiff && lockedUntil !== oldLockedUntil

  if (!hasNewLockedUntil && !hasOldLockedUntil) return null

  if (hasDiff && !hasOldLockedUntil) {
    // whole lockedUntil section green
    return (
      <div className="ml-2">
        <DiffedItem
          value={<LockedContainer value={lockedUntilFormatted} />}
          diffStatus="new"
        />
      </div>
    )
  }

  if (hasDiff && hasOldLockedUntil) {
    if (!hasNewLockedUntil) {
      // whole lockedUntil section red
      return (
        <div className="ml-2">
          <DiffedItem
            value={<LockedContainer value={oldLockedUntilFormatted} />}
            diffStatus="old"
          />
        </div>
      )
    }

    return (
      <LockedContainer
        value={
          <div className="flex">
            {/* Diff within the lockedUntil section */}
            {hasDiff && lockedUntilFormatted ? (
              <>
                <DiffedItem value={oldLockedUntilFormatted} diffStatus="old" />
                <DiffedItem value={lockedUntilFormatted} diffStatus="new" />
              </>
            ) : (
              // lockedUntil no diff
              lockedUntilFormatted
            )}
          </div>
        }
      />
    )
  }

  return <LockedContainer value={lockedUntilFormatted} />
}
