import { ArrowLeftOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Badge } from 'components/Badge'
import { Callout } from 'components/Callout'
import { Formik } from 'formik'
import { User } from 'models/database'
import { AccountSettingsForm } from './components/AccountSettingsForm'
import { useAccountSettingsDashboard } from './hooks/useAccountSettingsDashboard'
import { AccountSettingsSchema } from './lib/AccountSettingsSchema'

export const AccountSettingsDashboard = ({ user }: { user: User }) => {
  const {
    initialValues,
    lastEmailUpdated,
    onSubmit,
    onEmailResendClicked,
    onBackButtonClicked,
  } = useAccountSettingsDashboard({ user })

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
