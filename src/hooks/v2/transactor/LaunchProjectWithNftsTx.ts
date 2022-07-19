import { NetworkContext } from 'contexts/networkContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { getAddress } from '@ethersproject/address'

import { useContext } from 'react'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import { GroupedSplits, SplitGroup } from 'models/v2/splits'

import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint48 } from 'utils/v2/math'
import { parseEther } from 'ethers/lib/utils'

import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'
import { IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { TransactorInstance } from '../../Transactor'
import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/v2/metadataDomain'

const DEFAULT_MUST_START_AT_OR_AFTER = '1' // start immediately
const DEFAULT_MEMO = ''

type ContractNftRewardTierArg = {
  contributionFloor: BigNumber //uint128
  remainingQuantity: BigNumber //uint64
  initialQuantity: BigNumber //uint64
  tokenUri: string // full link to IPFS
  votingUnits: BigNumber
  reservedRate: BigNumber
}

// Maps cid to contributionFloor
export type TxNftArg = { [cid: string]: number }

function getJBDeployTieredNFTRewardDataSourceData({
  nftRewards,
  owner,
  directory,
}: {
  nftRewards: { [cid: string]: number }
  owner: string
  directory: string
}) {
  const tiersArg: ContractNftRewardTierArg[] = []

  Object.keys(nftRewards).map(cid => {
    const contributionFloorWei = parseEther(nftRewards[cid].toString())
    tiersArg.push({
      contributionFloor: contributionFloorWei,
      remainingQuantity: BigNumber.from(MaxUint48),
      initialQuantity: BigNumber.from(0),
      tokenUri: `${IPFS_GATEWAY_HOSTNAME}/${cid}`,
      votingUnits: BigNumber.from(0),
      reservedRate: BigNumber.from(0),
    })
  })

  return {
    directory,
    name: 'NAME',
    symbol: 'SYM',
    tokenUriResolver: '0x0000000000000000000000000000000000000000',
    contractUri: 'ipfs://null',
    owner,
    contributionToken: ETH_TOKEN_ADDRESS,
    tiers: tiersArg,
    shouldMintByDefault: false,
  }
}

export function useLaunchProjectWithNftsTx(): TransactorInstance<{
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
      !contracts.JBETHPaymentTerminal
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const args = [
      userAddress, // _owner
      getJBDeployTieredNFTRewardDataSourceData({
        nftRewards,
        owner: userAddress,
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
