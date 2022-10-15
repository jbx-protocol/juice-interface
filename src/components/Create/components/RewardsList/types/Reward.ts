import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'

export interface Reward {
  id: string
  tier: number
  title: string
  minimumContribution: { amount: number; currency: V2V3CurrencyOption }
  description: string
  maximumSupply?: number
  url: URL
  imgUrl: URL
}
