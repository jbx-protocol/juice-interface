import { ArrowLeftOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import axios from 'axios'
import { Badge } from 'components/Badge'
import { Callout } from 'components/Callout'
import { Formik, FormikHelpers } from 'formik'
import { User } from 'models/database'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import {
  emitErrorNotification,
  emitInfoNotification,
} from 'utils/notifications'
import { AccountSettingsForm } from './components/AccountSettingsForm'
import { AccountSettingsSchema } from './lib/AccountSettingsSchema'

export type AccountSettingsFormType = {
  bio?: string | null | undefined
  email?: string | null | undefined
  website?: string | null | undefined
  twitter?: string | null | undefined
}

const determinedTouched = (
  values: AccountSettingsFormType,
  initialValues: AccountSettingsFormType,
): Record<keyof AccountSettingsFormType, boolean> => {
  const touched: Record<keyof AccountSettingsFormType, boolean> = {} as Record<
    keyof AccountSettingsFormType,
    boolean
  >

  for (const k in values) {
    const key = k as keyof AccountSettingsFormType
    touched[key] = values[key] !== initialValues[key]
  }

  return touched
}

export const AccountSettingsDashboard = ({ user }: { user: User }) => {
  const router = useRouter()

  const [lastEmailUpdated, setLastEmailUpdated] = useState<string>()

  const initialValues: AccountSettingsFormType = useMemo(
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
      values: AccountSettingsFormType,
      helpers: FormikHelpers<AccountSettingsFormType>,
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

  const onBackButtonClicked = useCallback(() => {
    router.push(`/account/${user.wallet}`)
  }, [router, user.wallet])

  return (
    <div className="m-auto flex flex-col items-center ">
      <div className="flex w-full flex-col gap-y-10 py-8 px-4 md:w-[800px] md:px-16">
        <div>
          <h1 className="text-primary text-2xl dark:text-slate-100">
            <Trans>Profile details</Trans> <Badge variant="info">Beta</Badge>
          </h1>
          <div className="text-secondary">
            <Trans>
              Customize your public facing profile and add additional management
              information.
            </Trans>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={AccountSettingsSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, dirty }) => (
            <>
              <AccountSettingsForm address={user.wallet} />
              <div className="flex h-9 justify-between">
                <Button onClick={onBackButtonClicked}>
                  <ArrowLeftOutlined /> Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  form="accountSettings"
                  disabled={!dirty}
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </Formik>
        {lastEmailUpdated && (
          <Callout.Info>
            <Trans>
              Please check {lastEmailUpdated} and verify your new email address.
              <br />
              Still no email after a couple of minutes?{' '}
              <a onClick={onEmailResendClicked}>Click here to resend.</a>
            </Trans>
          </Callout.Info>
        )}
      </div>
    </div>
  )
}
