import { Trans } from '@lingui/macro'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { ErrorMessage, Field, Form } from 'formik'

export const AccountSettingsForm = () => (
  <Form
    id="accountSettings"
    name="accountSettings"
    className="flex w-1/2 flex-col gap-4"
  >
    <div className="flex flex-col">
      <label className="text-primary mb-2" htmlFor="email">
        <Trans>Email address</Trans>
      </label>
      <Field type="email" name="email" as={JuiceInput} />
      <ErrorMessage className="text-error pt-2" name="email" component="div" />
    </div>
  </Form>
)
