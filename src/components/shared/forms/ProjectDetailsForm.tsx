import { Button, Form, FormInstance, Space } from 'antd'
import { t, Trans } from '@lingui/macro'

import { FormItems } from 'components/shared/formItems'
import { normalizeHandle } from 'utils/formatHandle'
import { cidFromUrl, unpinIpfsFileByCid } from 'utils/ipfs'
import { CSSProperties } from 'react'
import TabDescription from 'components/v2/V2Create/TabDescription'

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
  loading,
  onValuesChange,
}: {
  form: FormInstance<ProjectDetailsFormFields>
  onFinish: (values: ProjectDetailsFormFields) => void
  hideProjectHandle?: boolean
  saveButton?: JSX.Element
  style?: CSSProperties
  loading?: boolean
  onValuesChange?: VoidFunction
}) {
  return (
    <Form
      scrollToFirstError={{ behavior: 'smooth' }}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={style}
      onValuesChange={() => onValuesChange?.()}
    >
      <Space direction="vertical" size="large">
        <div>
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
        </div>

        <div>
          <h3>
            <Trans>Links</Trans>
          </h3>
          <FormItems.ProjectLink name="infoUri" />
          <FormItems.ProjectTwitter name="twitter" />
          <FormItems.ProjectDiscord name="discord" />
        </div>

        <div>
          <h3>
            <Trans>Project page customizations</Trans>
          </h3>

          <FormItems.ProjectPayButton name="payButton" />
          <FormItems.ProjectPayDisclosure name="payDisclosure" />
        </div>
        <div>
          <Form.Item>
            {saveButton ?? (
              <Button htmlType="submit" loading={loading} type="primary">
                <span>
                  <Trans>Save project details</Trans>
                </span>
              </Button>
            )}
          </Form.Item>

          <TabDescription>
            <Trans>
              You can edit your project details after creation at any time, but
              the transaction will cost gas.
            </Trans>
          </TabDescription>
        </div>
      </Space>
    </Form>
  )
}
