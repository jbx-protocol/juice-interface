import axios from 'axios'
import { ContractInterface } from '@ethersproject/contracts'

import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useQuery, UseQueryResult } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

async function getRewardTierOfCid(cid: string) {
  const url = ipfsCidUrl(cid)
  const response = await axios.get(url)
  return response.data
}

// Retreives each NftRewardTier from IPFS given an array of CIDs (IpfsHashes)
// Returns an array of NftRewardTiers
export default function useNftRewards(
  CIDs: string[] | undefined,
): UseQueryResult<NftRewardTier[]> {
  return useQuery('nft-rewards', async () => {
    if (!CIDs?.length) {
      return
    }

    const getRewardTiers = () => {
      return Promise.all(CIDs.map(cid => getRewardTierOfCid(cid)))
    }

    return getRewardTiers()
  })
}

export const TEMPORARY_NFT_DEPLOYER_ABI: ContractInterface = [
  {
    inputs: [
      {
        internalType: 'contract IJBController',
        name: '_controller',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newDatasource',
        type: 'address',
      },
    ],
    name: 'DatasourceDeployed',
    type: 'event',
  },
  {
    inputs: [],
    name: 'controller',
    outputs: [
      { internalType: 'contract IJBController', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_projectId', type: 'uint256' },
      {
        components: [
          {
            internalType: 'contract IJBDirectory',
            name: 'directory',
            type: 'address',
          },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          {
            internalType: 'contract IJBTokenUriResolver',
            name: 'tokenUriResolver',
            type: 'address',
          },
          { internalType: 'string', name: 'contractUri', type: 'string' },
          { internalType: 'address', name: 'owner', type: 'address' },
          {
            internalType: 'address',
            name: 'contributionToken',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint128',
                name: 'contributionFloor',
                type: 'uint128',
              },
              {
                internalType: 'uint48',
                name: 'remainingQuantity',
                type: 'uint48',
              },
              {
                internalType: 'uint48',
                name: 'initialQuantity',
                type: 'uint48',
              },
              { internalType: 'uint16', name: 'votingUnits', type: 'uint16' },
              { internalType: 'uint16', name: 'reservedRate', type: 'uint16' },
              { internalType: 'string', name: 'tokenUri', type: 'string' },
            ],
            internalType: 'struct JBNFTRewardTier[]',
            name: 'tiers',
            type: 'tuple[]',
          },
          { internalType: 'bool', name: 'shouldMintByDefault', type: 'bool' },
        ],
        internalType: 'struct JBDeployTieredNFTRewardDataSourceData',
        name: '_deployTieredNFTRewardDataSourceData',
        type: 'tuple',
      },
    ],
    name: 'deployDataSource',
    outputs: [
      { internalType: 'address', name: 'newDatasource', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_owner', type: 'address' },
      {
        components: [
          {
            internalType: 'contract IJBDirectory',
            name: 'directory',
            type: 'address',
          },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          {
            internalType: 'contract IJBTokenUriResolver',
            name: 'tokenUriResolver',
            type: 'address',
          },
          { internalType: 'string', name: 'contractUri', type: 'string' },
          { internalType: 'address', name: 'owner', type: 'address' },
          {
            internalType: 'address',
            name: 'contributionToken',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint128',
                name: 'contributionFloor',
                type: 'uint128',
              },
              {
                internalType: 'uint48',
                name: 'remainingQuantity',
                type: 'uint48',
              },
              {
                internalType: 'uint48',
                name: 'initialQuantity',
                type: 'uint48',
              },
              { internalType: 'uint16', name: 'votingUnits', type: 'uint16' },
              { internalType: 'uint16', name: 'reservedRate', type: 'uint16' },
              { internalType: 'string', name: 'tokenUri', type: 'string' },
            ],
            internalType: 'struct JBNFTRewardTier[]',
            name: 'tiers',
            type: 'tuple[]',
          },
          { internalType: 'bool', name: 'shouldMintByDefault', type: 'bool' },
        ],
        internalType: 'struct JBDeployTieredNFTRewardDataSourceData',
        name: '_deployTieredNFTRewardDataSourceData',
        type: 'tuple',
      },
      {
        components: [
          {
            components: [
              { internalType: 'string', name: 'content', type: 'string' },
              { internalType: 'uint256', name: 'domain', type: 'uint256' },
            ],
            internalType: 'struct JBProjectMetadata',
            name: 'projectMetadata',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'uint256', name: 'duration', type: 'uint256' },
              { internalType: 'uint256', name: 'weight', type: 'uint256' },
              {
                internalType: 'uint256',
                name: 'discountRate',
                type: 'uint256',
              },
              {
                internalType: 'contract IJBFundingCycleBallot',
                name: 'ballot',
                type: 'address',
              },
            ],
            internalType: 'struct JBFundingCycleData',
            name: 'data',
            type: 'tuple',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'bool',
                    name: 'allowSetTerminals',
                    type: 'bool',
                  },
                  {
                    internalType: 'bool',
                    name: 'allowSetController',
                    type: 'bool',
                  },
                ],
                internalType: 'struct JBGlobalFundingCycleMetadata',
                name: 'global',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'reservedRate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'redemptionRate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'ballotRedemptionRate',
                type: 'uint256',
              },
              { internalType: 'bool', name: 'pausePay', type: 'bool' },
              {
                internalType: 'bool',
                name: 'pauseDistributions',
                type: 'bool',
              },
              { internalType: 'bool', name: 'pauseRedeem', type: 'bool' },
              { internalType: 'bool', name: 'pauseBurn', type: 'bool' },
              { internalType: 'bool', name: 'allowMinting', type: 'bool' },
              { internalType: 'bool', name: 'allowChangeToken', type: 'bool' },
              {
                internalType: 'bool',
                name: 'allowTerminalMigration',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'allowControllerMigration',
                type: 'bool',
              },
              { internalType: 'bool', name: 'holdFees', type: 'bool' },
              {
                internalType: 'bool',
                name: 'useTotalOverflowForRedemptions',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'useDataSourceForPay',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'useDataSourceForRedeem',
                type: 'bool',
              },
              { internalType: 'address', name: 'dataSource', type: 'address' },
            ],
            internalType: 'struct JBFundingCycleMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'mustStartAtOrAfter',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'group', type: 'uint256' },
              {
                components: [
                  { internalType: 'bool', name: 'preferClaimed', type: 'bool' },
                  {
                    internalType: 'bool',
                    name: 'preferAddToBalance',
                    type: 'bool',
                  },
                  { internalType: 'uint256', name: 'percent', type: 'uint256' },
                  {
                    internalType: 'uint256',
                    name: 'projectId',
                    type: 'uint256',
                  },
                  {
                    internalType: 'address payable',
                    name: 'beneficiary',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'lockedUntil',
                    type: 'uint256',
                  },
                  {
                    internalType: 'contract IJBSplitAllocator',
                    name: 'allocator',
                    type: 'address',
                  },
                ],
                internalType: 'struct JBSplit[]',
                name: 'splits',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct JBGroupedSplits[]',
            name: 'groupedSplits',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'contract IJBPaymentTerminal',
                name: 'terminal',
                type: 'address',
              },
              { internalType: 'address', name: 'token', type: 'address' },
              {
                internalType: 'uint256',
                name: 'distributionLimit',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'distributionLimitCurrency',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'overflowAllowance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'overflowAllowanceCurrency',
                type: 'uint256',
              },
            ],
            internalType: 'struct JBFundAccessConstraints[]',
            name: 'fundAccessConstraints',
            type: 'tuple[]',
          },
          {
            internalType: 'contract IJBPaymentTerminal[]',
            name: 'terminals',
            type: 'address[]',
          },
          { internalType: 'string', name: 'memo', type: 'string' },
        ],
        internalType: 'struct JBLaunchProjectData',
        name: '_launchProjectData',
        type: 'tuple',
      },
    ],
    name: 'launchProjectFor',
    outputs: [{ internalType: 'uint256', name: 'projectId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
