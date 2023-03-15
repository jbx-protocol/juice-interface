import { YUP_TWITTER } from 'utils/yup'
import * as Yup from 'yup'

export const AccountSettingsSchema = Yup.object().shape({
  bio: Yup.string().max(2048, 'Bio cannot be greater than 2048 characters'),
  email: Yup.string().email('Invalid email').max(320, 'Invalid email'),
  website: Yup.string().url('Invalid URL').max(2048, 'Invalid URL'),
  twitter: YUP_TWITTER,
})
