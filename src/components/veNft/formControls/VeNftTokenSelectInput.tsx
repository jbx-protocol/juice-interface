import { Trans } from '@lingui/macro'
import { Form, FormInstance, Select } from 'antd'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'

interface VeNftTokenSelectInputProps {
  form: FormInstance
}

const VeNftTokenSelectInput = ({ form }: VeNftTokenSelectInputProps) => {
  const { tokenAddress } = useContext(V2V3ProjectContext)
  return (
    <Form.Item
      name="useJbToken"
      label={
        <h3>
          <Trans>Token to Lock:</Trans>
        </h3>
      }
    >
      <Select onChange={val => form.setFieldsValue({ useJBToken: val })}>
        <Select.Option key={'projectToken'} value={false}>
          Project Token
        </Select.Option>
        {tokenAddress && (
          <Select.Option key={'ERC-20'} value={true}>
            Project ERC-20 Token
          </Select.Option>
        )}
      </Select>
    </Form.Item>
  )
}

export default VeNftTokenSelectInput
