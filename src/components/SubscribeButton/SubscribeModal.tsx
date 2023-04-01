import { CheckCircleOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Modal } from 'antd'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { ReactNode } from 'react'
import { useSubscribeModal } from './hooks/useSubscribeModal'

const FORM_NAME = 'SubscribeModal'

export const SubscribeModal = () => {
  const { open, schema, initialValues, closeModal, onSubmit } =
    useSubscribeModal()
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Modal
          open={open}
          title={t`Subscribe to project activity`}
          okButtonProps={{ form: FORM_NAME, htmlType: 'submit' }}
          confirmLoading={isSubmitting}
          onCancel={closeModal}
        >
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <CheckBullet
                text={t`Get notified when a contributor supports this project`}
              />
              <CheckBullet text={t`More updates coming soon`} />
            </div>
            <Form id={FORM_NAME}>
              <Field
                name="email"
                type="email"
                placeholder="Email"
                as={JuiceInput}
              />
              <ErrorMessage
                className="text-error pt-2"
                name="email"
                component="div"
              />
            </Form>
          </div>
        </Modal>
      )}
    </Formik>
  )
}

const CheckBullet = ({ text }: { text: ReactNode }) => (
  <div className="flex items-center gap-x-2">
    <CheckCircleOutlined className="text-action-primary" />
    {text}
  </div>
)
