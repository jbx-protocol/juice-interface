import { getAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { TransactorInstance } from 'hooks/Transactor'
import omit from 'lodash/omit'
import { JBPayDataSourceFundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { NftRewardsData } from 'redux/slices/editingV2Project'
import {
  buildJB721TierParams,
  findJBTiered721DelegateStoreAddress,
} from 'utils/nftRewards'
import { isValidMustStartAtOrAfter } from 'utils/v2v3/fundingCycle'
import { useV2ProjectTitle } from '../../v2v3/ProjectTitle'
import {
  DEFAULT_MUST_START_AT_OR_AFTER,
  ReconfigureTxArgs,
} from '../../v2v3/transactor/ReconfigureV2V3FundingCycleTx'
import { getJBDeployTiered721DelegateData } from './LaunchProjectWithNftsTx'

export type ReconfigureWithNftsTxArgs = ReconfigureTxArgs & NftRewardsData

export function useReconfigureV2V3FundingCycleWithNftsTx(): TransactorInstance<ReconfigureWithNftsTxArgs> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

  const projectTitle = useV2ProjectTitle()

  return async (
    {
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
      groupedSplits = [],
      mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
      memo,
      rewardTiers,
      CIDs,
      collectionMetadata,
    },
    txOpts,
  ) => {
    const JBTiered721DelegateStoreAddress =
      await findJBTiered721DelegateStoreAddress()

    const collectionName = collectionMetadata.name

    if (
      !transactor ||
      !projectId ||
      !CIDs ||
      !rewardTiers ||
      !JBTiered721DelegateStoreAddress ||
      !projectOwnerAddress ||
      !contracts ||
      !isValidMustStartAtOrAfter(
        mustStartAtOrAfter,
        fundingCycleData.duration,
      ) ||
      !collectionName
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    // build `delegateData`
    const tiers = buildJB721TierParams({ cids: CIDs, rewardTiers })

    const delegateData = await getJBDeployTiered721DelegateData({
      collectionUri: collectionMetadata.uri ?? '',
      collectionName,
      collectionSymbol: collectionMetadata.symbol ?? '',
      tiers,
      ownerAddress: projectOwnerAddress,
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
      projectId,
      delegateData, //_deployTiered721DelegateData
      {
        data: fundingCycleData,
        metadata: dataSourceFCMetadata,
        mustStartAtOrAfter,
        groupedSplits,
        fundAccessConstraints,
        memo,
      },
    ]

    return transactor(
      contracts.JBTiered721DelegateProjectDeployer,
      'reconfigureFundingCyclesOf',
      args,
      {
        ...txOpts,
        title: t`Reconfigure ${projectTitle} with new NFTs`,
      },
    )
  }
}
