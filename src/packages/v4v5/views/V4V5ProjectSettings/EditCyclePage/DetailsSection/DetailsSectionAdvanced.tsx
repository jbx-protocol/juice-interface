import {
  CONTROLLER_CONFIG_EXPLANATION,
  TERMINAL_CONFIG_EXPLANATION,
  TERMINAL_MIGRATION_EXPLANATION
} from 'components/strings'

import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { AdvancedDropdown } from 'components/Project/ProjectSettings/AdvancedDropdown'
import TooltipLabel from 'components/TooltipLabel'

export function DetailsSectionAdvanced() {
  return (
    <AdvancedDropdown>
      <Form.Item name="allowSetTerminals">
        <JuiceSwitch
          label={
            <TooltipLabel
              tip={TERMINAL_CONFIG_EXPLANATION}
              label={<Trans>Enable payment terminal configurations</Trans>}
            />
          }
        />
      </Form.Item>
      <Form.Item name="allowTerminalMigration">
        <JuiceSwitch
          label={
            <TooltipLabel
              tip={TERMINAL_MIGRATION_EXPLANATION}
              label={<Trans>Enable payment terminal migrations</Trans>}
            />
          }
        />
      </Form.Item>
      <Form.Item name="allowSetController">
        <JuiceSwitch
          label={
            <TooltipLabel
              tip={CONTROLLER_CONFIG_EXPLANATION}
              label={<Trans>Enable controller configurations</Trans>}
            />
          }
        />
      </Form.Item>
    </AdvancedDropdown>
  )
}
