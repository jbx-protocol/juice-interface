import { t } from '@lingui/macro'
import { Form, Switch } from 'antd'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TooltipLabel from 'components/TooltipLabel'

import { useState } from 'react'

export default function MaxSupplyFormItem({
  value,
  onChange,
}: {
  value: number | undefined
  onChange: (value: number | undefined) => void
}) {
  const [limitedSupplyEnabled, setLimitedSupplyEnabled] = useState<boolean>(
    Boolean(value),
  )

  return (
    <>
      <Form.Item
        label={
          <div style={{ display: 'flex' }}>
            <Switch
              checked={limitedSupplyEnabled}
              onChange={() => {
                setLimitedSupplyEnabled(!limitedSupplyEnabled)
                onChange(undefined)
              }}
              style={{ marginRight: '10px' }}
            />
            <TooltipLabel
              label={t`Limited supply`}
              tip={t`Set a limit on how many of these NFTs can be minted.`}
            />
          </div>
        }
        style={{ width: '100%' }}
      >
        <div style={{ display: 'flex' }}>
          {limitedSupplyEnabled ? (
            <Form.Item
              extra={
                limitedSupplyEnabled
                  ? t`The maximum supply of this NFT in circulation.`
                  : null
              }
              style={{ width: '100%', marginBottom: 0 }}
              name={'maxSupply'}
            >
              <FormattedNumberInput isInteger />
            </Form.Item>
          ) : null}
        </div>
      </Form.Item>
    </>
  )
}
