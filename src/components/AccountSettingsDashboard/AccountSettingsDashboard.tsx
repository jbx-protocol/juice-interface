import { ArrowLeftOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import axios from 'axios'
import { Badge } from 'components/Badge'
import { Callout } from 'components/Callout'
import { Formik, FormikHelpers } from 'formik'
import { User } from 'models/database'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import {
  emitErrorNotification,
  emitInfoNotification,
} from 'utils/notifications'
import { AccountSettingsForm } from './components/AccountSettingsForm'
import { AccountSettingsSchema } from './lib/AccountSettingsSchema'

type AccountSettingsFormType = { email: string | null }

export const AccountSettingsDashboard = ({ user }: { user: User }) => {
  const router = useRouter()

  const [lastEmailUpdated, setLastEmailUpdated] = useState<string>()

  const initialValues: AccountSettingsFormType = {
    email: user.email_verified ? user.email : null,
  }
  const onSubmit = useCallback(
    async (
      values: AccountSettingsFormType,
      helpers: FormikHelpers<AccountSettingsFormType>,
    ) => {
      try {
        if (!values.email) throw new Error('no email')
        await axios.post('/api/account/add-email', {
          email: values.email,
        })
        emitInfoNotification(
          `Request sent! Please check ${values.email} and verify your new email address.`,
        )
        setLastEmailUpdated(values.email)
      } catch (e) {
        console.error(
          'Error occurred whiling submitting account settings form',
          e,
        )
      } finally {
        helpers.setSubmitting(false)
      }
    },
    [],
  )

  const onEmailResendClicked = useCallback(async () => {
    if (!lastEmailUpdated)
      emitErrorNotification('Something has gone wrong, please contact support.')

    await axios.post('/api/account/add-email', {
      email: lastEmailUpdated,
    })
    emitInfoNotification(
      `Request sent! Please check ${lastEmailUpdated} and verify your new email address.`,
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
              <AccountSettingsForm />
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
