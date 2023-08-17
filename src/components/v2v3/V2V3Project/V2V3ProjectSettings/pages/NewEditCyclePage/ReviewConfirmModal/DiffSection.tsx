import { t } from '@lingui/macro'
import { AdvancedDropdown } from '../AdvancedDropdown'

export function DiffSection({
  content,
  advancedOptions,
}: {
  content: React.ReactNode
  advancedOptions: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      {content}
      <AdvancedDropdown
        title={t`Advanced options:`}
        className="border-t-0 pb-3 pt-0"
        headerClassName="flex-row-reverse justify-end gap-2 text-sm"
        contentContainerClass="pt-2"
      >
        <div className="pl-10 text-xs">{advancedOptions}</div>
      </AdvancedDropdown>
    </div>
  )
}
