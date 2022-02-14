import { Button, Form, FormInstance } from 'antd'
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
  hideProjectHandle = false,
}: {
  form: FormInstance<ProjectDetailsFormFields>
  onSave: (values: ProjectDetailsFormFields) => void
  hideProjectHandle?: boolean
}) {
  return (
    <Form form={form} layout="vertical" onFinish={onSave}>
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
      {!hideProjectHandle && (
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
      )}
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
        <Button htmlType="submit" type="primary">
          <Trans>Save project details</Trans>
        </Button>
      </Form.Item>
    </Form>
  )
}
