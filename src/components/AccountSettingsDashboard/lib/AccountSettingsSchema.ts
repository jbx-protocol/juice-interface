import * as Yup from 'yup'

export const AccountSettingsSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})
