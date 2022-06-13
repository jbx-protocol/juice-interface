import { t } from '@lingui/macro'
import { Form, Input } from 'antd'
import TooltipLabel from 'components/shared/TooltipLabel'

export default function CriteriaFormItem() {
  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        name={'criteria'}
        label={
          <TooltipLabel
            label={t`Contribution threshold`}
            tip={t`The contribution threshold above which you will reward contributors this NFT.`}
          />
        }
        extra={t`Contributors will receive the NFT when they contribute at least this amount.`}
        rules={[{ required: true }]}
      >
        <Input
          placeholder={'0.5'}
          type="string"
          autoComplete="off"
          suffix={t`ETH`}
        />
      </Form.Item>
    </div>
  )
}
