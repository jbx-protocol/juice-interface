import axios from 'axios'
import { VeNftTokenMetadata } from 'models/v2/veNft'
import { useQuery } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

export function useVeNftTokenMetadata(tokenUri: string | undefined) {
  const hash = tokenUri ? tokenUri.split('ipfs://')[1] : undefined
  return useQuery(
    ['nft-metadata', hash],
    async () => {
      if (!hash) {
        throw new Error('NFT hash not specified.')
      }
      const url = ipfsCidUrl(hash)
      const response = await axios.get(url)
      const metadata: VeNftTokenMetadata = {
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
