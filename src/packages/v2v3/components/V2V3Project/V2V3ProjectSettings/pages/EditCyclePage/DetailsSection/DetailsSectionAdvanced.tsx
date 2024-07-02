import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import {
  CONTROLLER_CONFIG_EXPLANATION,
  CONTROLLER_MIGRATION_EXPLANATION,
  TERMINAL_CONFIG_EXPLANATION,
  TERMINAL_MIGRATION_EXPLANATION,
} from 'components/strings'
import { AdvancedDropdown } from '../AdvancedDropdown'

export function DetailsSectionAdvanced() {
  return (
    <AdvancedDropdown>
      <Form.Item name="pausePay">
        <JuiceSwitch label={<Trans>Disable payments to this project</Trans>} />
      </Form.Item>
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
      <Form.Item name="allowControllerMigration">
        <JuiceSwitch
          label={
            <TooltipLabel
              tip={CONTROLLER_MIGRATION_EXPLANATION}
              label={<Trans>Enable controller migrations</Trans>}
            />
          }
        />
      </Form.Item>
    </AdvancedDropdown>
  )
}
