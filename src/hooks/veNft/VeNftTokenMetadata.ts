import { ipfsGetWithFallback } from 'lib/api/ipfs'
import { VeNftTokenMetadata } from 'models/veNft'
import { useQuery } from 'react-query'

export function useVeNftTokenMetadata(tokenUri: string | undefined) {
  const hash = tokenUri ? tokenUri.split('ipfs://')[1] : undefined

  return useQuery(
    ['nft-metadata', hash],
    async () => {
      if (!hash) {
        throw new Error('NFT hash not specified.')
      }
      const response = await ipfsGetWithFallback<VeNftTokenMetadata>(hash)
      const metadata = {
        thumbnailUri: response.data.thumbnailUri,
      }
      return metadata
    },
    {
      enabled: !!tokenUri,
      staleTime: 60000,
    },
  )
}
