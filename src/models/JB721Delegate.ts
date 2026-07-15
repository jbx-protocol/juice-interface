import { JB_721_TIER_PARAMS_V4 } from './nftRewards'

export enum JB721DelegateVersion {
  JB721DELEGATE_V3 = '3',
  JB721DELEGATE_V3_1 = '3-1',
  JB721DELEGATE_V3_2 = '3-2',
  JB721DELEGATE_V3_3 = '3-3',
  JB721DELEGATE_V3_4 = '3-4',
  JB721DELEGATE_V4 = '4',
  JB721DELEGATE_V5 = '5',
  JB721DELEGATE_V6 = '6',
}

/**
 * Tier config shape expected by the v6 JB721TiersHook (e.g. `adjustTiers`).
 * v6 nests the boolean flags into a `flags` tuple (adding `cantBuyWithCredits`)
 * and adds reserved-token split support via `splitPercent`/`splits`.
 */
export type JB721TierConfigV6 = {
  price: bigint
  initialSupply: number
  votingUnits: number
  reserveFrequency: number
  reserveBeneficiary: `0x${string}`
  encodedIpfsUri: `0x${string}`
  category: number
  discountPercent: number
  flags: {
    allowOwnerMint: boolean
    useReserveBeneficiaryAsDefault: boolean
    transfersPausable: boolean
    useVotingUnits: boolean
    cantBeRemoved: boolean
    cantIncreaseDiscountPercent: boolean
    cantBuyWithCredits: boolean
  }
  splitPercent: number
  splits: {
    percent: number
    projectId: bigint
    beneficiary: `0x${string}`
    preferAddToBalance: boolean
    lockedUntil: number
    hook: `0x${string}`
  }[]
}

/**
 * Converts a v4/v5-shaped 721 tier config into the v6 tuple shape.
 */
export function jb721TierConfigToV6(
  tier: JB_721_TIER_PARAMS_V4,
): JB721TierConfigV6 {
  return {
    price: tier.price,
    initialSupply: tier.initialSupply,
    votingUnits: tier.votingUnits,
    reserveFrequency: tier.reserveFrequency,
    reserveBeneficiary: tier.reserveBeneficiary,
    encodedIpfsUri: tier.encodedIPFSUri,
    category: tier.category,
    discountPercent: tier.discountPercent,
    flags: {
      allowOwnerMint: tier.allowOwnerMint,
      useReserveBeneficiaryAsDefault: tier.useReserveBeneficiaryAsDefault,
      transfersPausable: tier.transfersPausable,
      useVotingUnits: tier.useVotingUnits,
      cantBeRemoved: tier.cannotBeRemoved,
      cantIncreaseDiscountPercent: tier.cannotIncreaseDiscountPercent,
      cantBuyWithCredits: false,
    },
    splitPercent: 0,
    splits: [],
  }
}
