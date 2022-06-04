import axios from 'axios'
import { useQuery } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

export function useNFTMetadata(hash: string | undefined) {
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
      enabled: false,
      staleTime: 60000,
      retry: false,
    },
  )
}
