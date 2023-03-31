import { t } from '@lingui/macro'
import { Modal } from 'antd'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { ErrorMessage, Field, Form, Formik } from 'formik'
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
          title={t`Subscribe for updates!`}
          okButtonProps={{ form: FORM_NAME, htmlType: 'submit' }}
          confirmLoading={isSubmitting}
          onCancel={closeModal}
        >
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
        </Modal>
      )}
    </Formik>
  )
}
