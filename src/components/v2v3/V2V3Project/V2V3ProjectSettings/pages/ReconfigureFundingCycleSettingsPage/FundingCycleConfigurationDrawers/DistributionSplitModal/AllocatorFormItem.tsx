import { t, Trans } from '@lingui/macro'
import { Form, Radio } from 'antd'
import {
  V2_V3_ALLOCATOR_ADDRESS,
  NULL_ALLOCATOR_ADDRESS,
} from 'constants/contracts/mainnet/Allocators'
import { CV_V2 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContext } from 'react'

export function AllocatorFormItem() {
  const { cv } = useContext(V2V3ContractsContext)

  if (cv !== CV_V2) return null
  return (
    <Form.Item
      label={t`Project treasury version`}
      name="allocator"
      initialValue={NULL_ALLOCATOR_ADDRESS}
    >
      <Radio.Group>
        <Radio value={NULL_ALLOCATOR_ADDRESS}>
          <Trans>V2</Trans>
        </Radio>
        <Radio value={V2_V3_ALLOCATOR_ADDRESS}>
          <Trans>V3</Trans>
        </Radio>
      </Radio.Group>
    </Form.Item>
  )
}
