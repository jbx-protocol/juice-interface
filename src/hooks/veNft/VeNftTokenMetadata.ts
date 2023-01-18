import { getIpfsData } from 'lib/api/ipfs'
import { useQuery } from 'react-query'

export function useVeNftTokenMetadata(tokenUri: string | undefined) {
  const hash = tokenUri ? tokenUri.split('ipfs://')[1] : undefined

  return useQuery(
    ['nft-metadata', hash],
    async () => {
      if (!hash) {
        throw new Error('NFT hash not specified.')
      }
      const { data } = await getIpfsData<{ thumbnailUri: string }>(hash)

      return {
        thumbnailUri: data.thumbnailUri,
      }
    },
    {
      enabled: !!tokenUri,
      staleTime: 60000,
    },
  )
}
