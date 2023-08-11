import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { AdvancedDropdown } from '../AdvancedDropdown'
import { IssuanceRateReductionField } from './IssuanceRateReductionField'
import { RedemptionRateField } from './RedemptionRateField'
import { ReservedTokensField } from './ReservedTokensField'

export function TokensSectionAdvanced() {
  const advancedChildrenClasses =
    '[&>*]:border-b [&>*]:border-grey-300 [&>*]:dark:border-grey-600 [&>*]:pb-7'

  return (
    <AdvancedDropdown>
      <div className={`flex flex-col gap-7 ${advancedChildrenClasses}`}>
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
