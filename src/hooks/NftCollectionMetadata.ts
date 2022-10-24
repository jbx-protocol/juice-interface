import { NftCollectionMetadata } from 'models/nftRewardTier'
import { useQuery } from 'react-query'
import { cidFromUrl, ipfsGetWithFallback } from 'utils/ipfs'

// gets Nft Collection metadata from IPFS
export default function useNftCollectionMetadata(uri: string | undefined) {
  return useQuery(
    ['nft-collection-metadata', uri],
    async () => {
      const cid = cidFromUrl(uri)
      if (!cid) {
        throw new Error('NFT Contract URI not specified.')
      }
      const response = await ipfsGetWithFallback(cid)
      return response.data as NftCollectionMetadata
    },
    {
      enabled: !!uri,
      staleTime: 60000,
    },
  )
}
