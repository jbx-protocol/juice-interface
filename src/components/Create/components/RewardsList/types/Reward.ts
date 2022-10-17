export interface Reward {
  id: string
  title: string
  minimumContribution: number
  description: string | undefined
  maximumSupply?: number
  url: string | undefined
  imgUrl: string
}
