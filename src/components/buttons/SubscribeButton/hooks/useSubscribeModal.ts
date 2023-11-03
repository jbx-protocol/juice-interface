import { t } from '@lingui/macro'
import axios from 'axios'
import { ModalContext } from 'contexts/Modal'
import { FormikHelpers } from 'formik'
import { useCallback, useContext } from 'react'
import {
  emitErrorNotification,
  emitInfoNotification,
} from 'utils/notifications'
import * as Yup from 'yup'

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required')
    .max(320, 'Invalid email'),
})

// Determine Values based on the schema
type Values = Yup.InferType<typeof Schema>

export const useSubscribeModal = () => {
  const modal = useContext(ModalContext)
  const initialValues: Values = { email: '' }

  const onSubmit = useCallback(
    async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
      try {
        await axios.post('/api/account/update-details', values)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error(e)
        emitErrorNotification(e?.response?.data?.message ?? 'Unknown error')
      }
      setSubmitting(false)

      modal.closeModal()
      emitInfoNotification(
        t`Check your email for a confirmation link and retry subscribing.`,
      )
    },
    [modal],
  )

  return { schema: Schema, initialValues, onSubmit, ...modal }
}
