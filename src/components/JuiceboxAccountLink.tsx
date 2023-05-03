import EthereumAddress from './EthereumAddress'

export function JuiceboxAccountLink({
  address,
  className,
}: {
  address: string | undefined
  className?: string
}) {
  return (
    <EthereumAddress
      withEnsAvatar
      href={`/account/${address}`}
      address={address}
      className={className}
    />
  )
}
