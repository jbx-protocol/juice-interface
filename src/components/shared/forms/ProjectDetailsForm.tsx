import { Button, Form, FormInstance, Space } from 'antd'
import { t, Trans } from '@lingui/macro'

import { FormItems } from 'components/shared/formItems'
import { normalizeHandle } from 'utils/formatHandle'
import { cidFromUrl, unpinIpfsFileByCid } from 'utils/ipfs'

export type ProjectDetailsFormFields = {
  name: string
  description: string
  infoUri: string
  handle: string
  logoUri: string
  twitter: string
  discord: string
  payButton: string
  payDisclosure: string
}

export default function ProjectDetailsForm({
  form,
  onSave,
}: {
  form: FormInstance<ProjectDetailsFormFields>
  onSave: VoidFunction
}) {
  return (
    <Space direction="vertical" size="large">
      <h1>
        <Trans>Project details</Trans>
      </h1>
      <p>
        <Trans>
          Changes to these attributes can be made at any time and will be
          applied to your project immediately.
        </Trans>
      </p>

      <Form form={form} layout="vertical">
        <FormItems.ProjectName
          name="name"
          formItemProps={{
            rules: [{ required: true }],
          }}
          onChange={name => {
            const val = name ? normalizeHandle(name) : ''
            // Use `handle` state to enable ProjectHandle to validate while typing
            form.setFieldsValue({ handle: val })
          }}
        />
        <FormItems.ProjectHandleFormItem
          name="handle"
          initialValue={form.getFieldValue('handle')}
          requireState="notExist"
          formItemProps={{
            dependencies: ['name'],
            extra: t`Project handle must be unique.`,
          }}
          required
        />
        <FormItems.ProjectDescription name="description" />
        <FormItems.ProjectLink name="infoUri" />
        <FormItems.ProjectTwitter name="twitter" />
        <FormItems.ProjectDiscord name="discord" />
        <FormItems.ProjectPayButton name="payButton" />
        <FormItems.ProjectPayDisclosure name="payDisclosure" />
        <FormItems.ProjectLogoUri
          name="logoUri"
          initialUrl={form.getFieldValue('logoUri')}
          onSuccess={logoUri => {
            const prevUrl = form.getFieldValue('logoUri')
            // Unpin previous file
            form.setFieldsValue({ logoUri })
            if (prevUrl) unpinIpfsFileByCid(cidFromUrl(prevUrl))
          }}
        />
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            onClick={async () => {
              await form.validateFields()
              onSave()
            }}
          >
            <Trans>Save project details</Trans>
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
