import { Form, FormInstance } from 'antd'
import { t } from '@lingui/macro'

import { FormItems } from 'components/shared/formItems'
import { normalizeHandle } from 'utils/formatHandle'
import { cidFromUrl, unpinIpfsFileByCid } from 'utils/ipfs'

import FloatingSaveButton from 'components/v2/V2Create/FloatingSaveButton'
import { formBottomMargin } from 'components/v2/V2Create/constants'

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
  openNextTab,
}: {
  form: FormInstance<ProjectDetailsFormFields>
  onSave: (values: ProjectDetailsFormFields) => void
  hideProjectHandle?: boolean
  openNextTab?: VoidFunction
}) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSave}
      style={{ marginBottom: formBottomMargin }}
    >
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
      <FloatingSaveButton text={t`Next: Funding`} onClick={openNextTab} />
    </Form>
  )
}
