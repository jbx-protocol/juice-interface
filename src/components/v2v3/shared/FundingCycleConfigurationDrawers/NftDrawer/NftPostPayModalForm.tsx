import { t } from '@lingui/macro'
import { Form, FormInstance, Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useEffect, useMemo } from 'react'
import { NftPostPayModalFormFields } from './formFields'

export function NftPostPayModalForm({
  form,
  onFormUpdated,
}: {
  form: FormInstance<NftPostPayModalFormFields>
  onFormUpdated: (updated: boolean) => void
}) {
  const {
    nftRewards: { postPayModal },
  } = useAppSelector(state => state.editingV2Project)

  const initialValues = useMemo(
    () => ({
      ctaText: postPayModal?.ctaText,
      ctaLink: postPayModal?.ctaLink?.slice('https://'.length),
      content: postPayModal?.content,
    }),
    [postPayModal],
  )

  const handleFormChange = useCallback(() => {
    const hasUpdated =
      initialValues.ctaText !== form.getFieldValue('ctaText') ||
      initialValues.ctaLink !== form.getFieldValue('ctaLink') ||
      initialValues.content !== form.getFieldValue('content')
    onFormUpdated(hasUpdated)
  }, [form, initialValues, onFormUpdated])

  useEffect(() => {
    handleFormChange()
  }, [handleFormChange])

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onValuesChange={handleFormChange}
    >
      <Form.Item name="content" label={t`Message`}>
        <TextArea autoComplete="off" />
      </Form.Item>
      <Form.Item
        requiredMark="optional"
        name="ctaText"
        label={t`Call-to-action button text`}
      >
        <Input
          type="string"
          autoComplete="off"
          placeholder={'OK'}
          maxLength={20}
          showCount
        />
      </Form.Item>
      <Form.Item
        requiredMark="optional"
        name="ctaLink"
        label={t`Call-to-action button link`}
        extra={t`Button will close the modal if no link is given.`}
      >
        <Input type="string" autoComplete="off" prefix="https://" />
      </Form.Item>
    </Form>
  )
}
