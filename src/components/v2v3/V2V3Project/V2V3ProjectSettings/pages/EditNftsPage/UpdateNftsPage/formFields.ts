import { JB721GovernanceType } from 'models/nftRewards'

export type MarketplaceFormFields = {
  collectionName: string
  collectionSymbol: string
  collectionDescription: string
  onChainGovernance: JB721GovernanceType
}
