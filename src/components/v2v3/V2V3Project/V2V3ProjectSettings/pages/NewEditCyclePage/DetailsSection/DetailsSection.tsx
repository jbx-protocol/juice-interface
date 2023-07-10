import { Trans } from '@lingui/macro'
import { EditCycleHeading } from '../EditCycleHeader'

export function DetailsSection() {
  return (
    <div className="flex flex-col gap-2">
      {/* Cycle duration */}
      <div>
        <EditCycleHeading
          title={<Trans>Cycle duration</Trans>}
          description={
            <Trans>
              Edits to cycles must occur before the selected period. Deadlines
              ensure your contributors are informed of upcoming changes to your
              projects’ configuration.
            </Trans>
          }
        />
        {/* Cycle duration input */}
        {/* "Lock cycles" switch that, when unswitched, disables duration and reconfig-rules input, sets their vals to 0 and N.A. respectively */}
      </div>
      {/* Reconfig rules */}
      <div>
        <EditCycleHeading
          title={<Trans>Reconfiguration deadline</Trans>}
          description={
            <Trans>
              Edits to cycles must occur before the selected period. Deadlines
              ensure your contributors are informed of upcoming changes to your
              projects’ configuration.
            </Trans>
          }
        />
        {/* Rules dropdown (0, 1, 3, 7 days) */}
      </div>
      {/* Advanced dropdown:
        (all Switches):
        - "Enable custom reconfiguration deadline" (when enabled, also sets reconfig-rules to N.A.) 
            - subtitle = "Enter your own custom ballot smart contract to allow for a custom reconfiguration deadline."
        - "Enable payment terminal configuration" (with info tooltip)
        - Enable controller configuration (with info tooltip)
        - "Disable payments to this project" (pausePayments)
      */}
    </div>
  )
}
