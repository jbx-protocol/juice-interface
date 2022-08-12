import { NetworkContext } from 'contexts/networkContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { getAddress } from '@ethersproject/address'
import * as constants from '@ethersproject/constants'
import { useContext } from 'react'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import { GroupedSplits, SplitGroup } from 'models/v2/splits'
import { ContractNftRewardTier, NftRewardTier } from 'models/v2/nftRewardTier'

import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { isValidMustStartAtOrAfter } from 'utils/v2/fundingCycle'

import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'
import { IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { TransactorInstance } from '../../Transactor'
import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/v2/metadataDomain'
import { MaxUint48 } from 'constants/numbers'

const DEFAULT_MUST_START_AT_OR_AFTER = '1' // start immediately
const DEFAULT_MEMO = ''

// Maps cid to contributionFloor
export type TxNftArg = { [cid: string]: NftRewardTier }

function getJBDeployTieredNFTRewardDataSourceData({
  collectionName,
  collectionSymbol,
  nftRewards,
  ownerAddress,
  directory,
}: {
  collectionName: string
  collectionSymbol: string
  nftRewards: TxNftArg
  ownerAddress: string
  directory: string
}) {
  const tiersArg: ContractNftRewardTier[] = Object.keys(nftRewards).map(cid => {
    const contributionFloorWei = parseEther(
      nftRewards[cid].contributionFloor.toString(),
    )
    const maxSupply = nftRewards[cid].maxSupply
    const remainingQuantity = maxSupply
      ? BigNumber.from(maxSupply)
      : BigNumber.from(MaxUint48)
    return {
      contributionFloor: contributionFloorWei,
      remainingQuantity,
      initialQuantity: BigNumber.from(0),
      tokenUri: `https://${IPFS_GATEWAY_HOSTNAME}/ipfs/${cid}`,
      votingUnits: BigNumber.from(0),
      reservedRate: BigNumber.from(0),
    }
  })

  return {
    directory,
    name: collectionName,
    symbol: collectionSymbol,
    tokenUriResolver: constants.AddressZero,
    contractUri: 'ipfs://null',
    owner: ownerAddress,
    contributionToken: ETH_TOKEN_ADDRESS,
    tiers: tiersArg,
    shouldMintByDefault: true,
  }
}

export function useLaunchProjectWithNftsTx(): TransactorInstance<{
  collectionName: string
  collectionSymbol: string
  projectMetadataCID: string
  fundingCycleData: V2FundingCycleData
  fundingCycleMetadata: V2FundingCycleMetadata
  fundAccessConstraints: V2FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
  nftRewards: TxNftArg
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)

  return (
    {
      collectionName,
      collectionSymbol,
      projectMetadataCID,
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
      groupedSplits = [],
      mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
      nftRewards,
    },
    txOpts,
  ) => {
    if (
      !transactor ||
      !userAddress ||
      !contracts?.JBController ||
      !contracts.JBETHPaymentTerminal ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const args = [
      userAddress, // _owner
      getJBDeployTieredNFTRewardDataSourceData({
        collectionName,
        collectionSymbol,
        nftRewards,
        ownerAddress: userAddress,
        directory: getAddress(contracts.JBDirectory.address),
      }), // _deployTieredNFTRewardDataSourceData
      {
        projectMetadata: {
          domain: JUICEBOX_MONEY_METADATA_DOMAIN,
          content: projectMetadataCID,
        },
        data: fundingCycleData,
        metadata: fundingCycleMetadata,
        mustStartAtOrAfter,
        groupedSplits,
        fundAccessConstraints,
        terminals: [contracts.JBETHPaymentTerminal.address], //  _terminals (contract address of the JBETHPaymentTerminal),
        memo: DEFAULT_MEMO,
      }, // _launchProjectData
    ]

    return transactor(
      contracts.JBTieredLimitedNFTRewardDataSourceProjectDeployer,
      'launchProjectFor',
      args,
      txOpts,
    )
  }
}
