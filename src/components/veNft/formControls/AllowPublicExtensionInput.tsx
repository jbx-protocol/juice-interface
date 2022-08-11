import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Space, Switch } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import React, { useContext } from 'react'

interface AllowPublicExtensionInputProps {
  form: FormInstance
}

const AllowPublicExtensionInput = ({
  form,
}: AllowPublicExtensionInputProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <Form.Item
      name="allowPublicExtension"
      extra={t`Allows anyone to extend your lock position.`}
    >
      <Space>
        <Switch
          onChange={val => form.setFieldsValue({ allowPublicExtension: val })}
        />
        <span style={{ color: colors.text.primary, fontWeight: 500 }}>
          <Trans>Allow public lock extension</Trans>
        </span>
      </Space>
    </Form.Item>
  )
}

export default AllowPublicExtensionInput
