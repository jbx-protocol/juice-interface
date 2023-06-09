import { useJb721DelegateTokensQuery } from 'generated/graphql'
import { client } from 'lib/apollo/client'

/**
 * Return all the project's NFTs that are owned by the given account.
 */
export function useNftAccountBalance({
  dataSourceAddress,
  accountAddress,
}: {
  dataSourceAddress: string | undefined
  accountAddress: string | undefined
}) {
  return useJb721DelegateTokensQuery({
    client,
    variables: {
      where: {
        ...(dataSourceAddress ? { address: dataSourceAddress } : {}),
        ...(accountAddress ? { owner_: { wallet: accountAddress } } : {}),
      },
    },
  })
}
