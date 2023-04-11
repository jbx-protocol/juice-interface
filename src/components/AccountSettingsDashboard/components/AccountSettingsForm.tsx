import { t, Trans } from '@lingui/macro'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import TooltipLabel from 'components/TooltipLabel'
import { ErrorMessage, Field, FieldAttributes, Form } from 'formik'
import { InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { ensAvatarUrlForAddress } from 'utils/ens'

// Hack: Had to rebuild the Input from antd as it wasn't playing nicely with Formik :(
const InputPrefix = (
  props: InputHTMLAttributes<HTMLInputElement> & { prefix?: string },
) => {
  if (props.prefix) {
    return (
      <span className="stroke-secondary relative box-border inline-flex w-full min-w-0 list-none gap-0.5 text-ellipsis rounded-lg border bg-smoke-50 py-1 px-3 outline-0 focus-within:shadow-inputLight  dark:bg-slate-600  dark:focus-within:shadow-inputDark">
        <span className="text-secondary">{props.prefix}</span>
        <input
          className="relative m-0 inline-block w-full border-0 bg-transparent p-0 outline-0 placeholder:text-grey-400 dark:placeholder:text-slate-300"
          {...props}
        />
      </span>
    )
  }

  return (
    <input
      className="stroke-secondary w-full min-w-0 list-none text-ellipsis border py-1 px-3 outline-0 placeholder:text-grey-400 focus:shadow-inputLight  dark:placeholder:text-slate-300 dark:focus:shadow-inputDark"
      {...props}
    />
  )
}

export const AccountSettingsForm = ({ address }: { address: string }) => (
  <Form
    id="accountSettings"
    name="accountSettings"
    className="flex flex-col gap-4 md:w-1/2"
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
      prefix="@"
      label={<Trans>Twitter</Trans>}
      placeholder="JuiceboxETH"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      as={InputPrefix as any}
    />
  </Form>
)

function FormInput<T>({
  name,
  type,
  label,
  placeholder,
  as = JuiceInput,
  ...props
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
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        as={as}
        {...props}
      />
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
