import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Space, Switch } from 'antd'

interface AllowPublicExtensionInputProps {
  form: FormInstance
}

const AllowPublicExtensionInput = ({
  form,
}: AllowPublicExtensionInputProps) => {
  return (
    <Form.Item
      name="allowPublicExtension"
      extra={t`Allows anyone to extend your lock position.`}
    >
      <Space>
        <Switch
          onChange={val => form.setFieldsValue({ allowPublicExtension: val })}
        />
        <span className="font-medium text-black dark:text-slate-100">
          <Trans>Allow public lock extension</Trans>
        </span>
      </Space>
    </Form.Item>
  )
}

export default AllowPublicExtensionInput
