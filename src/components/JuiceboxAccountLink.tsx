import EthereumAddress from './EthereumAddress'

export function JuiceboxAccountLink({
  address,
  className,
  avatarClassName,
  withEnsAvatar,
}: {
  address: string | undefined
  avatarClassName?: string
  className?: string
  withEnsAvatar?: boolean
}) {
  return (
    <EthereumAddress
      className={className}
      avatarClassName={avatarClassName}
      withEnsAvatar={withEnsAvatar}
      href={`/account/${address}`}
      address={address}
    />
  )
}
