import { t, Trans } from '@lingui/macro'
import { Button, Form, FormInstance } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { FormItems } from 'components/formItems'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { RichEditor } from 'components/RichEditor'

import { ProjectTagName } from 'models/project-tags'
import { inputIsLengthRule } from 'utils/antdRules/inputIsLengthRule'
import { normalizeHandle } from 'utils/format/formatHandle'

export type ProjectDetailsFormFields = {
  name: string
  description: string
  projectTagline: string
  projectRequiredOFACCheck?: boolean
  infoUri: string
  handle: string
  logoUri: string
  coverImageUri: string
  twitter: string
  telegram: string
  discord: string
  payButton: string
  payDisclosure: string
  tags: ProjectTagName[]
}

export function ProjectDetailsForm({
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
  const initialLogoUrl = useWatch('logoUri', form)
  const initialCoverImageUri = useWatch('coverImageUri', form)

  return (
    <Form
      scrollToFirstError={{ behavior: 'smooth' }}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={() => onValuesChange?.()}
    >
      <div className="flex flex-col gap-6">
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
          <Form.Item
            name="projectTagline"
            label={t`Project tagline`}
            extra={t`Add a brief one-sentence summary of your project.`}
            rules={[
              inputIsLengthRule({
                label: t`Tagline`,
                max: 100,
              }),
            ]}
          >
            <JuiceInput />
          </Form.Item>
          <Form.Item name="description" label={t`Project description`}>
            <RichEditor />
          </Form.Item>

          <Form.Item
            // Fix for RichEditor margin whackiness
            className="pt-4"
            name={'logoUri'}
            label={t`Logo`}
          >
            <FormImageUploader
              value={initialLogoUrl}
              maxSizeKBs={10000}
              text={t`Upload`}
            />
          </Form.Item>
        </div>

        <div>
          <FormItems.ProjectTags
            name="tags"
            initialTags={form.getFieldValue('tags')}
            onChange={tags => form.setFieldsValue({ tags })}
          />
        </div>

        <div>
          <MinimalCollapse header={<Trans>Project links</Trans>}>
            <FormItems.ProjectLink name="infoUri" />
            <FormItems.ProjectTwitter name="twitter" />
            <FormItems.ProjectDiscord name="discord" />
            <FormItems.ProjectTelegram name="telegram" />
          </MinimalCollapse>
        </div>

        <div>
          <MinimalCollapse header={<Trans>Project page customizations</Trans>}>
            <Form.Item
              name={'coverImageUri'}
              label={t`Cover image`}
              tooltip={t`Add a cover image to your project page. This will be displayed at the top of your project page.`}
              extra={t`1400px x 256px image size recommended.`}
            >
              <FormImageUploader
                value={initialCoverImageUri}
                maxSizeKBs={10000}
                text={t`Upload`}
              />
            </Form.Item>

            <FormItems.ProjectPayDisclosure name="payDisclosure" />
          </MinimalCollapse>
        </div>
        {/* <div>
          <MinimalCollapse header={<Trans>Additional settings</Trans>}>
            <Form.Item
              name="projectRequiredOFACCheck"
              label={t`OFAC Sanctions screening`}
              extra={t`Activating this option enables running the user's wallet address against OFAC’s Specially Designated Nationals (SDN) list`}
            >
              <JuiceSwitch label={t`Check User Wallet Address`} />
            </Form.Item>
          </MinimalCollapse>
        </div> */}
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
      </div>
    </Form>
  )
}
