import { t, Trans } from '@lingui/macro'
import { Form, InputNumber, Radio } from 'antd'
import { FormItems } from 'components/formItems'
import {
  NULL_ALLOCATOR_ADDRESS,
  V1_V3_ALLOCATOR_ADDRESS,
} from 'constants/contracts/mainnet/Allocators'
import { BigNumber } from 'ethers'
import { useState } from 'react'

export function ProjectPayoutFormItem({
  initialHandle,
  initialAllocator,
  onChange,
}: {
  initialHandle: string | BigNumber | undefined
  initialAllocator: string | undefined
  onChange: (id: string) => void
}) {
  // need state here (as well as form value in parent component)
  // to handle the changing of the V1/V3 project input field
  const [allocator, setAllocator] = useState<string | undefined>(
    initialAllocator,
  )

  const V1ProjectHandleFormItem = (
    <FormItems.ProjectHandleFormItem
      name="handle"
      requireState="exists"
      initialValue={initialHandle}
      returnValue="id"
      onValueChange={onChange}
      formItemProps={{
        label: t`V1 Project handle`,
      }}
      required
    />
  )

  return (
    <>
      <Form.Item label={t`Project treasury version`} name={'allocator'}>
        <Radio.Group
          value={allocator}
          onChange={e => setAllocator(e.target.value)}
        >
          <Radio value={NULL_ALLOCATOR_ADDRESS}>
            <Trans>V1</Trans>
          </Radio>
          <Radio value={V1_V3_ALLOCATOR_ADDRESS}>
            <Trans>V3</Trans>
          </Radio>
        </Radio.Group>
      </Form.Item>

      {allocator === NULL_ALLOCATOR_ADDRESS ? (
        V1ProjectHandleFormItem
      ) : (
        <Form.Item name={'projectId'} label={t`V3 Project ID`} required>
          <InputNumber className="w-full" />
        </Form.Item>
      )}
    </>
  )
}
