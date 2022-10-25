import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { parseEther } from '@ethersproject/units'
import { t } from '@lingui/macro'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { MaxUint48, WAD_DECIMALS } from 'constants/numbers'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { NftRewardTier } from 'models/nftRewardTier'
import { GroupedSplits, SplitGroup } from 'models/splits'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { encodeIPFSUri, ipfsCidUrl } from 'utils/ipfs'
import { findJBTiered721DelegateStoreAddress } from 'utils/nftRewards'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { isValidMustStartAtOrAfter } from 'utils/v2v3/fundingCycle'
import { useV2ProjectTitle } from '../ProjectTitle'

enum JB721GovernanceType {
  NONE,
  TIERED,
  GLOBAL,
}

const DEFAULT_MUST_START_AT_OR_AFTER = '1' // start immediately
const DEFAULT_MEMO = ''

// Maps cid to contributionFloor
export type TxNftArg = { [cid: string]: NftRewardTier }

async function getJBDeployTiered721DelegateData({
  collectionCID,
  collectionName,
  collectionSymbol,
  nftRewards,
  ownerAddress,
  directory,
  JBFundingCycleStoreAddress,
  JBPricesAddress,
}: {
  collectionCID: string
  collectionName: string
  collectionSymbol: string
  nftRewards: TxNftArg
  ownerAddress: string
  directory: string
  JBFundingCycleStoreAddress: string
  JBPricesAddress: string
}) {
  const JBTiered721DelegateStoreAddress =
    await findJBTiered721DelegateStoreAddress()
  const tiers = Object.keys(nftRewards).map(cid => {
    const contributionFloorWei = parseEther(
      nftRewards[cid].contributionFloor.toString(),
    )
    const maxSupply = nftRewards[cid].maxSupply
    const initialQuantity = maxSupply ?? MaxUint48
    const encodedIPFSUri = encodeIPFSUri(cid)

    return {
      contributionFloor: contributionFloorWei,
      lockedUntil: BigNumber.from(0),
      initialQuantity,
      votingUnits: 0,
      reservedRate: 0,
      reservedTokenBeneficiary: constants.AddressZero,
      encodedIPFSUri,
      allowManualMint: false,
      shouldUseBeneficiaryAsDefault: false,
    }
  })

  const pricing = {
    tiers,
    currency: V2V3_CURRENCY_ETH,
    decimals: WAD_DECIMALS,
    prices: JBPricesAddress,
  }

  return {
    directory,
    name: collectionName,
    symbol: collectionSymbol,
    fundingCycleStore: JBFundingCycleStoreAddress,
    baseUri: ipfsCidUrl(''),
    tokenUriResolver: constants.AddressZero,
    contractUri: ipfsCidUrl(collectionCID),
    owner: ownerAddress,
    pricing,
    reservedTokenBeneficiary: constants.AddressZero,
    store: JBTiered721DelegateStoreAddress,
    flags: {
      lockReservedTokenChanges: false,
      lockVotingUnitChanges: false,
      lockManualMintingChanges: false,
      pausable: false,
    },
    governanceType: JB721GovernanceType.TIERED,
  }
}

export function useLaunchProjectWithNftsTx(): TransactorInstance<{
  collectionCID: string
  collectionName: string
  collectionSymbol: string
  projectMetadataCID: string
  fundingCycleData: V2V3FundingCycleData
  fundingCycleMetadata: V2V3FundingCycleMetadata
  fundAccessConstraints: V2V3FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
  nftRewards: TxNftArg
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)

  const { userAddress } = useWallet()
  const projectTitle = useV2ProjectTitle()

  return async (
    {
      collectionCID,
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
      !contracts ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      const missingParam = !transactor
        ? 'transactor'
        : !userAddress
        ? 'userAddress'
        : !contracts
        ? 'contracts'
        : null

      txOpts?.onError?.(
        new DOMException(
          `Transaction failed, missing argument "${
            missingParam ?? '<unknown>'
          }".`,
        ),
      )

      return Promise.resolve(false)
    }

    const delegateData = await getJBDeployTiered721DelegateData({
      collectionCID,
      collectionName,
      collectionSymbol,
      nftRewards,
      ownerAddress: userAddress,
      directory: getAddress(contracts.JBDirectory.address),
      JBFundingCycleStoreAddress: getAddress(
        contracts.JBFundingCycleStore.address,
      ),
      JBPricesAddress: getAddress(contracts.JBPrices.address),
    })

    const args = [
      userAddress, // _owner
      delegateData, // _deployTiered721DelegateData
      {
        projectMetadata: {
          domain: JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN,
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
      contracts.JBTiered721DelegateProjectDeployer,
      'launchProjectFor',
      args,
      {
        ...txOpts,
        title: t`Launch ${projectTitle}`,
      },
    )
  }
}
