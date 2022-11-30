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
          <div className="flex">
            <Switch
              className="mr-2"
              checked={limitedSupplyEnabled}
              onChange={() => {
                setLimitedSupplyEnabled(!limitedSupplyEnabled)
                onChange(undefined)
              }}
            />
            <TooltipLabel
              label={t`Limited supply`}
              tip={t`Set a limit on how many of these NFTs can be minted.`}
            />
          </div>
        }
        className="w-full"
      >
        <div className="flex">
          {limitedSupplyEnabled ? (
            <Form.Item
              className="mb-0 w-full"
              extra={
                limitedSupplyEnabled
                  ? t`The maximum supply of this NFT in circulation.`
                  : null
              }
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
