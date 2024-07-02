import { useQuery } from '@tanstack/react-query'
import { ipfsFetch } from 'lib/api/ipfs'
import { NftCollectionMetadata } from 'models/nftRewards'
import { cidFromUrl } from 'utils/ipfs'

// gets Nft Collection metadata from IPFS
export function useNftCollectionMetadata(uri: string | undefined) {
  return useQuery({
    queryKey: ['nft-collection-metadata', uri],
    queryFn: async () => {
      if (!uri) {
        throw new Error('NFT Contract URI not specified.')
      }

      const cid = cidFromUrl(uri)
      if (!cid) {
        throw new Error('NFT Contract URI invalid.')
      }

      const response = await ipfsFetch<NftCollectionMetadata>(cid)
      return response.data
    },
    enabled: !!uri,
  })
}
