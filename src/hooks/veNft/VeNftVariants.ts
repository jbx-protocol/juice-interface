import { VARIANTS_HASH } from 'constants/contracts/goerli/veNftProject'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ipfsGet } from 'lib/api/ipfs'
import { VeNftVariant } from 'models/veNft'
import { useQuery } from 'react-query'
import { featureFlagEnabled } from 'utils/featureFlags'

type VeNftMetadataResponse = {
  metadata: {
    name: string
    jbx_range: string
  }
}

export function useVeNftVariants() {
  const hash = VARIANTS_HASH
  return useQuery(
    ['nft-variants', hash],
    async () => {
      if (!hash) {
        throw new Error('Variants hash not specified.')
      }
      const file = hash + '/characters.json'
      const { data } = await ipfsGet<Record<string, VeNftMetadataResponse>>(
        file,
      )
      const variants: VeNftVariant[] = Object.entries(data).map(
        ([id, variant]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { name, jbx_range } = (variant as any).metadata
          const split = jbx_range.split('-')
          const tokensStakedMin = parseInt(split[0].replaceAll(',', ''))
          const tokensStakedMax =
            split.length > 1
              ? parseInt(split[1].replaceAll(',', ''))
              : undefined
          return {
            id: parseInt(id),
            name: name.replaceAll('_', ' '),
            tokensStakedMin,
            tokensStakedMax,
          }
        },
      )
      return variants
    },
    {
      enabled: !!hash && featureFlagEnabled(FEATURE_FLAGS.VENFT),
      staleTime: 60000,
    },
  )
}
