import { getIpfsData } from 'lib/api/ipfs'
import { NftCollectionMetadata } from 'models/nftRewardTier'
import { useQuery } from 'react-query'
import { cidFromUrl } from 'utils/ipfs'

// gets Nft Collection metadata from IPFS
export function useNftCollectionMetadata(uri: string | undefined) {
  return useQuery(
    ['nft-collection-metadata', uri],
    async () => {
      if (!uri) {
        throw new Error('NFT Contract URI not specified.')
      }

      const cid = cidFromUrl(uri)
      if (!cid) {
        throw new Error('NFT Contract URI invalid.')
      }

      const { data } = await getIpfsData<NftCollectionMetadata>(cid)
      return data
    },
    {
      enabled: !!uri,
    },
  )
}
