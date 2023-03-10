import * as Yup from 'yup'

export const AccountSettingsSchema = Yup.object().shape({
  bio: Yup.string(),
  email: Yup.string().email('Invalid email'),
  website: Yup.string().url('Invalid URL'),
  twitter: Yup.string(),
})
