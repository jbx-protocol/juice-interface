import { BigNumber } from '@ethersproject/bignumber'
import { Button, Form, FormInstance, Input, Space } from 'antd'
import { ContractName } from 'constants/contract-name'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { useCallback, useMemo, useState } from 'react'

export type ProjectDetailsFormFields = {
  link: string
  handle: string
  logoUri: string
}

export default function ProjectDetails({
  form,
  onSave,
}: {
  form: FormInstance<ProjectDetailsFormFields>
  onSave: VoidFunction
}) {
  const [handleInputVal, setHandleInputVal] = useState<string>()
  const handle = form.getFieldValue('handle')

  const handleExists = useContractReader<boolean>({
    contract: ContractName.Projects,
    functionName: 'handleResolver',
    args: useMemo(() => {
      if (!handleInputVal) return null

      let bytes = utils.formatBytes32String(handleInputVal.toLowerCase())

      while (bytes.length > 0 && bytes.charAt(bytes.length - 1) === '0') {
        bytes = bytes.substring(0, bytes.length - 2)
      }

      return [bytes]
    }, [handleInputVal]),
    formatter: useCallback((res: BigNumber) => res?.gt(0), []),
  })

  const formatHandle = (text: string) =>
    text
      .split('')
      .filter(char => ![' ', ',', '.', '-'].includes(char))
      .join('')

  return (
    <Space direction="vertical" size="large">
      <h1>Project details</h1>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Handle"
          name="handle"
          extra={
            handleExists ? (
              <span style={{ color: 'red' }}>Handle not avilable</span>
            ) : undefined
          }
          status={handleExists ? 'warning' : undefined}
          rules={[{ required: true }]}
        >
          <Input
            prefix="@"
            placeholder="yourProject"
            type="string"
            autoComplete="off"
            value={handle}
            onChange={e => {
              const val = formatHandle(e.target.value)
              form.setFieldsValue({ handle: val })
              setHandleInputVal(val)
            }}
          />
        </Form.Item>
        <Form.Item
          name="link"
          label="Link"
          extra="Add a URL that points to where someone could find more information about
        your project. (optional)"
        >
          <Input
            placeholder="http://your-project.com"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="logoUri"
          label="Logo URL"
          extra="The URL of your logo hosted somewhere on the internet."
        >
          <Input
            placeholder="http://ipfs.your-host.io/your-logo.jpg"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              htmlType="submit"
              type="primary"
              onClick={async () => {
                await form.validateFields()
                onSave()
              }}
            >
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  )
}
