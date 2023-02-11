import { JB721GovernanceType } from 'models/nftRewardTier'

export type MarketplaceFormFields = {
  collectionName: string
  collectionSymbol: string
  collectionDescription: string
  onChainGovernance: JB721GovernanceType
}

export type NftPostPayModalFormFields = {
  content: string
  ctaButton: string
  ctaLink: string
}
