import axios from 'axios'
import { useQuery } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

export function useNFTMetadata(tokenUri: string | undefined) {
  const hash = tokenUri ? tokenUri.split('ipfs://')[1] : undefined
  return useQuery(
    ['nft-metadata', hash],
    async () => {
      if (!hash) {
        throw new Error('NFT hash not specified.')
      }
      const url = ipfsCidUrl(hash)
      const response = await axios.get(url)
      return response.data
    },
    {
      enabled: !!tokenUri,
      staleTime: 60000,
    },
  )
}
