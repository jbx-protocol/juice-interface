import {
    PREVENT_OVERSPENDING_EXPLANATION,
    USE_DATASOURCE_FOR_REDEEM_EXPLANATION,
} from 'components/strings'

import { t } from '@lingui/macro'
import { Form } from 'antd'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'

export function NftAdvancedFormItems() {
  return (
    <>
      <Form.Item
        name="useDataSourceForRedeem"
        extra={USE_DATASOURCE_FOR_REDEEM_EXPLANATION}
      >
        <JuiceSwitch label={t`Use NFTs for redemptions`} />
      </Form.Item>
      <Form.Item
        name="preventOverspending"
        extra={PREVENT_OVERSPENDING_EXPLANATION}
      >
        <JuiceSwitch label={t`Payments restricted to NFT purchases`} />
      </Form.Item>
    </>
  )
}
