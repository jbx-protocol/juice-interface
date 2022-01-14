import { useState } from 'react'

import userEvent from '@testing-library/user-event'

import { useForm } from 'antd/lib/form/Form'

import { Form } from 'antd'

import { render } from '../../../../../test/test-utils'
import EthAddress from '../EthAddress'

const lookupAddress = jest.fn()
const resolveName = jest.fn()

jest.mock('../../../../constants/readProvider', () => ({
  lookupAddress,
  resolveName,
}))

function TestableEthAddress() {
  const [testForm] = useForm<{ address: string }>()

  const [, setAddress] = useState('')

  return (
    <Form form={testForm}>
      <Form.Item name="address">
        <EthAddress
          name="address"
          onAddressChange={a => setAddress(a)}
          defaultValue={undefined}
        />
      </Form.Item>
    </Form>
  )
}

describe('react using the contract to resolve ETH addresses', () => {
  test('does not resolve', () => {
    const screen = render(<TestableEthAddress />)

    screen.debug()

    userEvent.type(screen.getByRole('textbox'), 'test.eth')

    expect(lookupAddress).toHaveBeenCalled()
  })

  test('resolves to a known ENS name', () => {})

  test('contract failed, throws an error', () => {})
})
