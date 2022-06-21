import { NFTRewardTier } from 'models/v2/nftRewardTier'

type TraitType = 'tiers' | 'supply'

type CloudFunctionRewardTier = {
  edition: number
  isBooleanAmount: boolean
  name: string
  description: string
  shouldPreferSymbol: boolean
  minter: string
  decimals: number
  publishers: string[]
  date: string //"2022-03-04T12:09:18.159Z",
  uri: string
  image: string
  attributes: [
    {
      trait_type: TraitType // "tiers"
      value: string // Float value ETH amount e.g. "1.5"
    },
    {
      trait_type: TraitType // supply
      value: string // Int value of max supply e.g. "10000"
    },
  ]
  rights: string
}

// Calls a cloudfunction created by @tankbottoms
// Returns cid which points to where this NFT data is stored on IPFS
export default async function useNFTRewardsToIPFS(nftRewards: NFTRewardTier[]) {
  const args: CloudFunctionRewardTier[] = []
  nftRewards.forEach(rewardTier => {
    args.push({
      edition: 0,
      isBooleanAmount: true,
      name: rewardTier.name,
      description: rewardTier.description,
      shouldPreferSymbol: false,
      minter: 'JuiceboxDAO',
      decimals: 0,
      publishers: ['JuiceboxDAO'],
      date: '2022-03-04T12:09:18.159Z',
      uri: 'https://juicebox.money',
      image: rewardTier.imageUrl,
      attributes: [
        {
          trait_type: 'tiers',
          value: '1.26',
        },
        {
          trait_type: 'supply',
          value: '5',
        },
      ],
      rights: '',
    })
  })
  const response = await fetch(
    'https://us-central1-ipfs-scratch-space.cloudfunctions.net/pinning',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    },
  )

  const { cid } = await response.json()
  return cid
}
