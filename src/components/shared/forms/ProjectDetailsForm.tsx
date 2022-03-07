import { Button, Form, FormInstance } from 'antd'
import { t, Trans } from '@lingui/macro'

import { FormItems } from 'components/shared/formItems'
import { normalizeHandle } from 'utils/formatHandle'
import { cidFromUrl, unpinIpfsFileByCid } from 'utils/ipfs'
import { CSSProperties } from 'react'

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
  onFinish,
  hideProjectHandle = false,
  saveButton,
  style,
}: {
  form: FormInstance<ProjectDetailsFormFields>
  onFinish: (values: ProjectDetailsFormFields) => void
  hideProjectHandle?: boolean
  saveButton?: JSX.Element
  style?: CSSProperties
}) {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={style}>
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
        {saveButton ?? (
          <Button htmlType="submit" type="primary">
            <Trans>Save project details</Trans>
          </Button>
        )}
      </Form.Item>
    </Form>
  )
}
