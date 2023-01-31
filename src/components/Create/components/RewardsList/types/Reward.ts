export interface Reward {
  id: string
  title: string
  minimumContribution: number
  description: string | undefined
  maximumSupply?: number
  url: string | undefined
  reservedRate: number | undefined
  beneficiary: string | undefined
  votingWeight: number | undefined
  imgUrl: string
}
