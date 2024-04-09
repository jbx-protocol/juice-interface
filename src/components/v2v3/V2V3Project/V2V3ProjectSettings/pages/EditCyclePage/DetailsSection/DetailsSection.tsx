import { Trans } from '@lingui/macro'
import { CYCLE_EXPLANATION } from 'components/strings'
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
          description={CYCLE_EXPLANATION}
        />
        <DurationFields />
      </div>
      <div className="flex flex-col gap-2">
        <EditCycleHeader
          title={<Trans>Edit deadline</Trans>}
          description={
            <Trans>
              Edits to cycles must occur before the selected period. Deadlines
              ensure your contributors are informed of upcoming changes to your
              project's configuration.
            </Trans>
          }
        />
        <CycleDeadlineDropdown className="h-10" />
      </div>
      <DetailsSectionAdvanced />
    </>
  )
}
