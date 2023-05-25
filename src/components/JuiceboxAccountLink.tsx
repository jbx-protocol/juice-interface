import EthereumAddress from './EthereumAddress'

export function JuiceboxAccountLink({
  address,
  className,
  withEnsAvatar,
}: {
  address: string | undefined
  className?: string
  withEnsAvatar?: boolean
}) {
  return (
    <EthereumAddress
      withEnsAvatar={withEnsAvatar}
      href={`/account/${address}`}
      address={address}
      className={className}
    />
  )
}
