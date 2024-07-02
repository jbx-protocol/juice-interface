import { formatDate } from 'utils/format/formatDate'
import { DiffedItem } from '../../DiffedItem'
import { LockedUntilValue } from '../../SplitItem/LockedUntilValue'

export function DiffedLockedUntil({
  lockedUntil,
  oldLockedUntil,
}: {
  lockedUntil: number | undefined
  oldLockedUntil?: number
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
  const hasDiff = lockedUntil !== oldLockedUntil

  if (!hasNewLockedUntil && !hasOldLockedUntil) return null

  if (hasDiff && !hasOldLockedUntil) {
    // whole lockedUntil section green
    return (
      <div className="ml-2">
        <DiffedItem
          value={<LockedUntilValue lockedUntil={lockedUntil} />}
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
            value={<LockedUntilValue lockedUntil={oldLockedUntil} />}
            diffStatus="old"
          />
        </div>
      )
    }

    return (
      <LockedUntilValue
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

  return <LockedUntilValue value={lockedUntilFormatted} />
}
