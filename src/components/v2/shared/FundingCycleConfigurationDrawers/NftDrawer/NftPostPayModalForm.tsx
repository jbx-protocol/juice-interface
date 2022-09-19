import { t } from '@lingui/macro'
import { Form, FormInstance, Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { useAppSelector } from 'hooks/AppSelector'
import { NftPostPayModalFormFields } from './formFields'

export function NftPostPayModalForm({
  form,
}: {
  form: FormInstance<NftPostPayModalFormFields>
}) {
  const {
    nftRewards: { postPayModal },
  } = useAppSelector(state => state.editingV2Project)

  const initialValues = {
    ctaText: postPayModal?.ctaText,
    ctaLink: postPayModal?.ctaLink?.slice('https://'.length),
    content: postPayModal?.content,
  }

  return (
    <Form layout="vertical" form={form} initialValues={initialValues}>
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
          maxLength={10}
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
