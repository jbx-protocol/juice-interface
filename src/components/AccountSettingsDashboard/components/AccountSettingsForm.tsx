import { t, Trans } from '@lingui/macro'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import TooltipLabel from 'components/TooltipLabel'
import { ErrorMessage, Field, FieldAttributes, Form } from 'formik'
import { twMerge } from 'tailwind-merge'
import { ensAvatarUrlForAddress } from 'utils/ens'

export const AccountSettingsForm = ({ address }: { address: string }) => (
  <Form
    id="accountSettings"
    name="accountSettings"
    className="flex w-1/2 flex-col gap-4"
  >
    <TooltipLabel
      label={
        <label className="text-primary text-lg">
          <Trans>Avatar</Trans>
        </label>
      }
      tip={t`Avatar images are pulled from ENS.`}
    />
    <AvatarImage className="mb-4 w-32" address={address} />
    <FormInput
      name="bio"
      label={<Trans>Bio</Trans>}
      // Hack to get JuiceTextArea working
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      as={JuiceTextArea as any}
    />
    <FormInput name="email" type="email" label={<Trans>Email address</Trans>} />
    <span className="text-primary mt-4 text-lg">
      <Trans>Socials</Trans>
    </span>
    <FormInput
      name="website"
      label={<Trans>Website</Trans>}
      placeholder="https://juicebox.money"
    />
    <FormInput
      name="twitter"
      label={<Trans>Twitter</Trans>}
      placeholder="@JuiceboxETH"
    />
  </Form>
)

function FormInput<T>({
  name,
  type,
  label,
  placeholder,
  as = JuiceInput,
}: FieldAttributes<T> & {
  label?: React.ReactNode
}) {
  return (
    <div>
      {label && (
        <div className="mb-2">
          <label className="text-primary" htmlFor={name}>
            {label}
          </label>
        </div>
      )}
      <Field type={type} name={name} placeholder={placeholder} as={as} />
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
