import { Trans } from '@lingui/macro'

export function ArchivedBadge() {
  return (
    <div className="absolute top-0 right-0 bg-smoke-100 py-0.5 px-1 text-xs font-medium text-grey-400 dark:bg-slate-600 dark:text-slate-200">
      <Trans>ARCHIVED</Trans>
    </div>
  )
}
