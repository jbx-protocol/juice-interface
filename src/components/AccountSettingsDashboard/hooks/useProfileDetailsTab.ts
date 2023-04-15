import { t } from '@lingui/macro'
import axios from 'axios'
import { FormikHelpers } from 'formik'
import { User } from 'models/database'
import { useCallback, useMemo, useState } from 'react'
import {
  emitErrorNotification,
  emitInfoNotification,
} from 'utils/notifications'

type ProfileDetailsFormType = {
  bio?: string | null | undefined
  email?: string | null | undefined
  website?: string | null | undefined
  twitter?: string | null | undefined
}

export const useProfileDetailsTab = ({ user }: { user: User }) => {
  const [lastEmailUpdated, setLastEmailUpdated] = useState<string>()

  const initialValues: ProfileDetailsFormType = useMemo(
    () => ({
      bio: user.bio ?? '',
      email: user.email_verified ? user.email : '',
      website: user.website ?? '',
      twitter: user.twitter ?? '',
    }),
    [user.bio, user.email, user.email_verified, user.twitter, user.website],
  )

  const onSubmit = useCallback(
    async (
      values: ProfileDetailsFormType,
      helpers: FormikHelpers<ProfileDetailsFormType>,
    ) => {
      const touched = determinedTouched(values, initialValues)
      const formWasTouched = Object.values(touched).reduce(
        (acc, curr) => acc || curr,
        false,
      )
      if (!formWasTouched) return
      try {
        await axios.post('/api/account/update-details', values)
        const emailWasUpdated =
          values.email && touched.email && lastEmailUpdated !== values.email
        if (emailWasUpdated) {
          emitInfoNotification(
            t`Check ${values.email} and verify your new email address.`,
          )
          setLastEmailUpdated(values.email ?? '')
        }
        emitInfoNotification(t`Profile details were updated`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error(
          'Error occurred while submitting account settings form',
          e,
        )
        emitErrorNotification(
          e?.response?.data?.message ?? 'Unknown error occurred.',
        )
      }

      helpers.setSubmitting(false)
    },
    [initialValues, lastEmailUpdated],
  )

  const onEmailResendClicked = useCallback(async () => {
    if (!lastEmailUpdated)
      emitErrorNotification(
        t`Something has gone wrong, please contact support.`,
      )

    try {
      await axios.post('/api/account/update-email', {
        email: lastEmailUpdated,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Error occurred while resubmitting email', e)
      emitErrorNotification(
        e?.response?.data?.message ?? 'Unknown error occurred.',
      )
    }
    emitInfoNotification(
      t`Check ${lastEmailUpdated} and verify your new email address.`,
    )
  }, [lastEmailUpdated])

  return {
    initialValues,
    lastEmailUpdated,
    onSubmit,
    onEmailResendClicked,
  }
}

const determinedTouched = (
  values: ProfileDetailsFormType,
  initialValues: ProfileDetailsFormType,
): Record<keyof ProfileDetailsFormType, boolean> => {
  const touched: Record<keyof ProfileDetailsFormType, boolean> = {} as Record<
    keyof ProfileDetailsFormType,
    boolean
  >

  for (const k in values) {
    const key = k as keyof ProfileDetailsFormType
    touched[key] = values[key] !== initialValues[key]
  }

  return touched
}
