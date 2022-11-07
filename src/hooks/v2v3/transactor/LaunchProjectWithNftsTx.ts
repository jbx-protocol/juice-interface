import { getAddress } from '@ethersproject/address'
import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { WAD_DECIMALS } from 'constants/numbers'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import omit from 'lodash/omit'
import {
  JB721GovernanceType,
  JB721PricingParams,
  JB721TierParams,
  JBDeployTiered721DelegateData,
} from 'models/nftRewardTier'
import { GroupedSplits, SplitGroup } from 'models/splits'
import {
  JBPayDataSourceFundingCycleMetadata,
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { ipfsUrl } from 'utils/ipfs'
import { findJBTiered721DelegateStoreAddress } from 'utils/nftRewards'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { isValidMustStartAtOrAfter } from 'utils/v2v3/fundingCycle'
import { useV2ProjectTitle } from '../ProjectTitle'

const DEFAULT_MUST_START_AT_OR_AFTER = '1' // start immediately
const DEFAULT_MEMO = ''

export async function getJBDeployTiered721DelegateData({
  collectionCID,
  collectionName,
  collectionSymbol,
  tiers,
  ownerAddress,
  JBDirectoryAddress,
  JBFundingCycleStoreAddress,
  JBPricesAddress,
  JBTiered721DelegateStoreAddress,
}: {
  collectionCID: string
  collectionName: string
  collectionSymbol: string
  tiers: JB721TierParams[]
  ownerAddress: string
  JBDirectoryAddress: string
  JBFundingCycleStoreAddress: string
  JBPricesAddress: string
  JBTiered721DelegateStoreAddress: string
}): Promise<JBDeployTiered721DelegateData> {
  const pricing: JB721PricingParams = {
    tiers,
    currency: V2V3_CURRENCY_ETH,
    decimals: WAD_DECIMALS,
    prices: JBPricesAddress,
  }

  return {
    directory: JBDirectoryAddress,
    name: collectionName,
    symbol: collectionSymbol,
    fundingCycleStore: JBFundingCycleStoreAddress,
    baseUri: ipfsUrl(''),
    tokenUriResolver: constants.AddressZero,
    contractUri: ipfsUrl(collectionCID),
    owner: ownerAddress,
    pricing,
    reservedTokenBeneficiary: constants.AddressZero,
    store: JBTiered721DelegateStoreAddress,
    flags: {
      lockReservedTokenChanges: false,
      lockVotingUnitChanges: false,
      lockManualMintingChanges: false,
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
  tiers: JB721TierParams[]
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
      tiers,
    },
    txOpts,
  ) => {
    const JBTiered721DelegateStoreAddress =
      await findJBTiered721DelegateStoreAddress()

    if (
      !transactor ||
      !userAddress ||
      !contracts ||
      !JBTiered721DelegateStoreAddress ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      const missingParam = !transactor
        ? 'transactor'
        : !userAddress
        ? 'userAddress'
        : !contracts
        ? 'contracts'
        : !JBTiered721DelegateStoreAddress
        ? 'JBTiered721DelegateStoreAddress'
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
      tiers,
      ownerAddress: userAddress,
      JBDirectoryAddress: getAddress(contracts.JBDirectory.address),
      JBFundingCycleStoreAddress: getAddress(
        contracts.JBFundingCycleStore.address,
      ),
      JBPricesAddress: getAddress(contracts.JBPrices.address),
      JBTiered721DelegateStoreAddress,
    })

    // NFT launch tx does not accept `useDataSourceForPay` and `dataSource` (see contracts:`JBPayDataSourceFundingCycleMetadata`)
    const dataSourceFCMetadata: JBPayDataSourceFundingCycleMetadata = omit(
      fundingCycleMetadata,
      ['useDataSourceForPay', 'dataSource'],
    )

    const args = [
      userAddress, // _owner
      delegateData, // _deployTiered721DelegateData
      {
        projectMetadata: {
          domain: JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN,
          content: projectMetadataCID,
        },
        data: fundingCycleData,
        metadata: dataSourceFCMetadata,
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
