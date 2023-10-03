import { Trans } from '@lingui/macro'

export function DiffSection({
  content,
  advancedOptions,
}: {
  content: React.ReactNode
  advancedOptions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 pt-1 text-sm">
      {content}
      {advancedOptions ? (
        <>
          <div className="py-3 font-semibold">
            <Trans>Advanced options:</Trans>
          </div>
          {advancedOptions}
        </>
      ) : null}
    </div>
  )
}
