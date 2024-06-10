import { useNfTsQuery } from 'generated/graphql'
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
  return useNfTsQuery({
    where: {
      ...(dataSourceAddress
        ? { collection_: { address: dataSourceAddress } }
        : {}),
      ...(accountAddress ? { owner_: { wallet: accountAddress } } : {}),
    },
  })
}
