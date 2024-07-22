import { LockOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { formatDate } from 'utils/format/formatDate'

export function LockedUntilValue({
  lockedUntil,
  value,
}: {
  lockedUntil?: bigint | undefined
  value?: JSX.Element | string
}) {
  const hasLockedUntil = lockedUntil && lockedUntil > 0n

  const lockedUntilFormatted = hasLockedUntil
    ? formatDate(lockedUntil * 1000n, 'yyyy-MM-DD')
    : undefined

  if (!lockedUntilFormatted) return null

  return (
    <Tooltip
      title={
        <Trans>
          Locked until <strong>{value}</strong>
        </Trans>
      }
      className="h-22px ml-2 flex items-center text-sm text-grey-500 dark:text-grey-300"
    >
      <LockOutlined className="mr-1" />
      <div className="flex">{value ?? lockedUntilFormatted}</div>
    </Tooltip>
  )
}
