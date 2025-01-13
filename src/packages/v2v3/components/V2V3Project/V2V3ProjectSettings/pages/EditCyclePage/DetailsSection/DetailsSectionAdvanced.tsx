import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { AdvancedDropdown } from 'components/Project/ProjectSettings/AdvancedDropdown'
import TooltipLabel from 'components/TooltipLabel'
import { JuiceDatePicker } from 'components/inputs/JuiceDatePicker'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import {
  CONTROLLER_CONFIG_EXPLANATION,
  CONTROLLER_MIGRATION_EXPLANATION,
  TERMINAL_CONFIG_EXPLANATION,
  TERMINAL_MIGRATION_EXPLANATION,
} from 'components/strings'
import moment from 'moment'

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

      <Form.Item
        label={
          <span className="text-sm font-normal">
            <Trans>Start time</Trans>
          </span>
        }
      >
        <Form.Item valuePropName={'date'} name="mustStartAtOrAfter" noStyle>
          <JuiceDatePicker
            showNow={false}
            showToday={false}
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={current => {
              if (!current) return false
              const now = moment()
              if (current.isSame(now, 'day') || current.isAfter(now, 'day'))
                return false
              return true
            }}
            showTime={{ defaultValue: moment('00:00:00') }}
          />
        </Form.Item>
      </Form.Item>
    </AdvancedDropdown>
  )
}
