import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { AdvancedDropdown } from '../NewEditCyclePage/AdvancedDropdown'

export function LaunchNftsAdvanced() {
  return (
    <AdvancedDropdown>
      {/* On-chain Governace (simple 2-option Select) */}
      {/* Payment success message */}
      <Form.Item name="useDataSourceForRedeem">
        <JuiceSwitch
          label={
            <TooltipLabel
              label={<Trans>Use NFTs for redemption</Trans>}
              tip={
                <Trans>
                  Contributors will redeem from the project's treasury with
                  their NFTs as opposed to standard project tokens.
                </Trans>
              }
            />
          }
        />
      </Form.Item>
      {/* Prevent NFT overspending */}
    </AdvancedDropdown>
  )
}
