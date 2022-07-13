import { NftRewardTier } from 'models/v2/nftRewardTier'

export type CloudFunctionRewardTier = {
  edition: number
  isBooleanAmount: boolean
  name: string
  description: string | undefined
  shouldPreferSymbol: boolean
  minter: string
  publishers: string
  date: string //"2022-03-04T12:09:18.159Z",
  uri: string | undefined
  image: string
  attributes_tiers: number
  attributes_supply: number
  rights: string
}

// Calls a cloudfunction to upload to IPFS created by @tankbottoms
// Returns cid which points to where this NFT data is stored on IPFS
export default async function useNftRewardsToIPFS(
  nftRewards: NftRewardTier[],
): Promise<string> {
  const now = new Date().toISOString()
  const args: CloudFunctionRewardTier[] = []
  nftRewards.forEach(rewardTier => {
    args.push({
      edition: 0,
      isBooleanAmount: true,
      name: rewardTier.name,
      description: rewardTier.description ?? '',
      shouldPreferSymbol: false,
      minter: 'JuiceboxDAO',
      publishers: 'JuiceboxDAO',
      date: now,
      uri: rewardTier.externalLink,
      image: rewardTier.imageUrl,
      attributes_tiers: rewardTier.paymentThreshold,
      attributes_supply: rewardTier.maxSupply,
      rights: '',
    })
  })

  console.info('>>> Calling IPFS CloudFunction with args: ', args)

  const response = await fetch(
    'https://us-central1-ipfs-scratch-space.cloudfunctions.net/pinning',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        json: args,
        format: 'json',
      }),
    },
  )

  const { cid } = await response.json()
  console.info('>>> IPFS CloudFunction returned cid: ', cid)
  return cid
}
