import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'

function RevnetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.5l7 3.5v7l-7-3.5v-7zm9 11v-7l7-3.5v7l-7 3.5z" />
    </svg>
  )
}

export function RevnetBadge() {
  return (
    <Tooltip
      placement="bottom"
      title={
        <Trans>This project is a Revnet</Trans>
      }
    >
      <span className="flex">
        <RevnetIcon />
      </span>
    </Tooltip>
  )
}
