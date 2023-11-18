import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Badge } from 'components/Badge'
import { Callout } from 'components/Callout/Callout'
import { Formik } from 'formik'
import { User } from 'models/database'
import { useProfileDetailsTab } from '../hooks/useProfileDetailsTab'
import { AccountSettingsSchema } from '../lib/AccountSettingsSchema'
import { AccountSettingsForm } from './AccountSettingsForm'

export const ProfileDetailsTab = ({ user }: { user: User }) => {
  const { initialValues, lastEmailUpdated, onEmailResendClicked, onSubmit } =
    useProfileDetailsTab({ user })
  return (
    <div className="flex flex-col gap-y-10">
      <div>
        <h1 className="text-primary flex items-center gap-2 text-2xl dark:text-slate-100">
          <Trans>Profile details</Trans> <Badge variant="info">Beta</Badge>
        </h1>
        <div className="text-secondary">
          <Trans>Customize your public facing profile and other details.</Trans>
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
            <div className="flex h-9">
              <Button
                type="primary"
                htmlType="submit"
                form="accountSettings"
                disabled={!dirty}
                loading={isSubmitting}
              >
                <Trans>Save profile details</Trans>
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
  )
}
