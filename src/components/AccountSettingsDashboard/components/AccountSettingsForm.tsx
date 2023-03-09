import { Trans } from '@lingui/macro'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { ErrorMessage, Field, Form } from 'formik'
import { twMerge } from 'tailwind-merge'
import { ensAvatarUrlForAddress } from 'utils/ens'

export const AccountSettingsForm = ({ address }: { address: string }) => (
  <Form
    id="accountSettings"
    name="accountSettings"
    className="flex w-1/2 flex-col gap-4"
  >
    <label className="text-primary text-lg">
      <Trans>Avatar</Trans>
    </label>
    <AvatarImage className="mb-4 w-32" address={address} />
    <FormInput name="bio" label={<Trans>Bio</Trans>} as={JuiceTextArea} />
    <FormInput name="email" type="email" label={<Trans>Email address</Trans>} />
    <span className="text-primary mt-4 text-lg">
      <Trans>Socials</Trans>
    </span>
    <FormInput name="website" label={<Trans>Website</Trans>} />
    <FormInput name="twitter" label={<Trans>Twitter</Trans>} />
  </Form>
)

const FormInput = ({
  name,
  type,
  label,
  as = JuiceInput,
}: {
  name: string
  label?: React.ReactNode
  type?: string
  as?: unknown
}) => {
  return (
    <div>
      {label && (
        <div className="mb-2">
          <label className="text-primary" htmlFor={name}>
            {label}
          </label>
        </div>
      )}
      <Field type={type} name={name} as={as} />
      <ErrorMessage className="text-error pt-2" name={name} component="div" />
    </div>
  )
}

const AvatarImage = ({
  className,
  address,
}: {
  className?: string
  address: string
}) => {
  const avatarImgUrl = ensAvatarUrlForAddress(address, {
    size: 128,
  })
  return (
    <img
      className={twMerge('rounded-full', className)}
      src={avatarImgUrl}
    ></img>
  )
}
