import { V2ContractName } from 'models/v2/contracts'
import { ContractNftRewardTier, NftRewardTier } from 'models/v2/nftRewardTier'
import { decodeEncodedIPFSUri } from 'utils/ipfs'

// Following three functions get the latest deployments of the NFT contracts from the NPM package
// TODO: will need to incorporate `networkName` into this first function when contracts deployed to mainnet
export async function getLatestNftContractDeployments() {
  const latestNftContractDeployments = await import(
    '@jbx-protocol/juice-nft-rewards/broadcast/Deploy.s.sol/4/run-latest.json'
  )
  return latestNftContractDeployments
}

export async function getLatestNftProjectDeployerContractAddress() {
  const latestNftContractDeployments = await getLatestNftContractDeployments()
  return latestNftContractDeployments.default.transactions.filter(
    tx => tx.contractName === V2ContractName.JBTiered721DelegateProjectDeployer,
  )?.[0]?.contractAddress
}

export async function getLatestNftDelegateStoreContractAddress() {
  const latestNftContractDeployments = await getLatestNftContractDeployments()
  return latestNftContractDeployments.default.transactions.filter(
    tx => tx.contractName === V2ContractName.JBTiered721DelegateStore,
  )?.[0]?.contractAddress
}

// Returns the highest NFT reward tier that a payer is eligible given their pay amount
export function getNftRewardTier({
  payAmountETH,
  nftRewardTiers,
}: {
  payAmountETH: number
  nftRewardTiers: NftRewardTier[]
}) {
  let nftReward: NftRewardTier | null = null
  // all nft's who's thresholds are below the pay amount
  const eligibleNftRewards = nftRewardTiers.filter(rewardTier => {
    return rewardTier.contributionFloor <= payAmountETH
  })
  if (eligibleNftRewards.length) {
    // take the maximum which is the only one received by payer
    nftReward = eligibleNftRewards.reduce((prev, curr) => {
      return prev.contributionFloor > curr.contributionFloor ? prev : curr
    })
  }
  return nftReward
}

// Sorts array of nft reward tiers by contributionFloor
export function sortNftRewardTiers(
  rewardTiers: NftRewardTier[],
): NftRewardTier[] {
  return rewardTiers.sort((a, b) =>
    a.contributionFloor > b.contributionFloor
      ? 1
      : b.contributionFloor > a.contributionFloor
      ? -1
      : 0,
  )
}

// returns an array of CIDs from a given array of RewardTier obj's
export function CIDsOfNftRewardTiersResponse(
  nftRewardTiersResponse: ContractNftRewardTier[],
): string[] {
  const cids: string[] = nftRewardTiersResponse
    .map((contractRewardTier: ContractNftRewardTier) => {
      return decodeEncodedIPFSUri(contractRewardTier.encodedIPFSUri)
    })
    .filter(cid => cid.length > 0)
  return cids
}

// Default name for NFT collections on NFT marketplaces
export const defaultNftCollectionName = (projectName: string | undefined) =>
  `${projectName?.length ? projectName : "Your project's"} NFT rewards`

// Default description for NFT collections on NFT marketplaces
export const defaultNftCollectionDescription = (
  projectName: string | undefined,
) =>
  `NFTs rewarded to ${
    projectName?.length ? projectName : 'your project'
  }'s Juicebox contributors.`
