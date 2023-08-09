import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { AdvancedDropdown } from '../AdvancedDropdown'
import { IssuanceRateReductionField } from './IssuanceRateReductionField'
import { RedemptionRateField } from './RedemptionRateField'
import { ReservedTokensField } from './ReservedTokensField'

export function TokensSectionAdvanced() {
  return (
    <AdvancedDropdown>
      <div className="flex flex-col gap-5">
        <ReservedTokensField />
        <IssuanceRateReductionField />
        <RedemptionRateField />
        <Form.Item name="allowTokenMinting" className="mb-0">
          <JuiceSwitch
            label={<Trans>Enable project owner token minting</Trans>}
            description={
              <Trans>
                Project owner can mint tokens for themselves and others at any
                time.
              </Trans>
            }
          />
        </Form.Item>
        <Form.Item name="pauseTransfers">
          <JuiceSwitch label={<Trans>Disable project token transfers</Trans>} />
        </Form.Item>
      </div>
    </AdvancedDropdown>
  )
}
