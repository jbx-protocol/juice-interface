import { Trans } from '@lingui/macro'
import { EditCycleHeader } from '../EditCycleHeader'
import CycleDeadlineDropdown from './CycleDeadlineDropdown'
import { DetailsSectionAdvanced } from './DetailsSectionAdvanced'
import { DurationFields } from './DurationFields'

export function DetailsSection() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <EditCycleHeader
          title={<Trans>Cycle duration</Trans>}
          description={
            <Trans>
              Edits to cycles must occur before the selected period. Deadlines
              ensure your contributors are informed of upcoming changes to your
              projects’ configuration.
            </Trans>
          }
        />
        <DurationFields />
      </div>
      <div className="flex flex-col gap-2">
        <EditCycleHeader
          title={<Trans>Reconfiguration deadline</Trans>}
          description={
            <Trans>
              Edits to cycles must occur before the selected period. Deadlines
              ensure your contributors are informed of upcoming changes to your
              projects’ configuration.
            </Trans>
          }
        />
        <CycleDeadlineDropdown className="h-10" />
      </div>
      <DetailsSectionAdvanced />
    </>
  )
}
