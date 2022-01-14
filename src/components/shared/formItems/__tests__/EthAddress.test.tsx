import { useState } from 'react'

import userEvent from '@testing-library/user-event'

import { useForm } from 'antd/lib/form/Form'

import { Form } from 'antd'

import { render } from '../../../../../test/test-utils'
import EthAddress from '../EthAddress'
import { readProvider } from '../../../../constants/readProvider'

jest.mock('../../../../constants/readProvider')

function TestableEthAddress() {
  const [testForm] = useForm<{ address: string }>()

  const [, setAddress] = useState('')

  return (
    <Form form={testForm}>
      <Form.Item name="address">
        <EthAddress
          onAddressChange={a => setAddress(a)}
          defaultValue={undefined}
        />
      </Form.Item>
    </Form>
  )
}

describe('react using the contract to resolve ETH addresses', () => {
  test('does not resolve', async () => {
    const screen = render(<TestableEthAddress />)

    userEvent.type(await screen.findByRole('textbox'), 'test.eth')

    expect(readProvider.lookupAddress).toHaveBeenCalled()
    expect(readProvider.resolveName).toHaveBeenCalled()
  })

  test('resolves to a known ENS name', () => {})

  test('contract failed, throws an error', () => {})
})
