import { t, Trans } from '@lingui/macro'
import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/formItems'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { normalizeHandle } from 'utils/format/formatHandle'

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
  loading,
  onValuesChange,
}: {
  form: FormInstance<ProjectDetailsFormFields>
  onFinish: (values: ProjectDetailsFormFields) => void
  hideProjectHandle?: boolean
  saveButton?: JSX.Element
  loading?: boolean
  onValuesChange?: VoidFunction
}) {
  return (
    <Form
      scrollToFirstError={{ behavior: 'smooth' }}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={() => onValuesChange?.()}
    >
      <Space direction="vertical" size="large" className="w-full">
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
              form.setFieldsValue({ logoUri })
              onValuesChange?.()
            }}
            formItemProps={{ style: { marginBottom: 0 } }}
          />
        </div>
        <div>
          <MinimalCollapse header={<Trans>Project links</Trans>}>
            <FormItems.ProjectLink name="infoUri" />
            <FormItems.ProjectTwitter name="twitter" />
            <FormItems.ProjectDiscord name="discord" />
          </MinimalCollapse>
        </div>

        <div>
          <MinimalCollapse header={<Trans>Project page customizations</Trans>}>
            <FormItems.ProjectPayButton name="payButton" />
            <FormItems.ProjectPayDisclosure name="payDisclosure" />
          </MinimalCollapse>
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
        </div>
      </Space>
    </Form>
  )
}
