import { getAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { LaunchFundingCyclesData } from 'hooks/v2v3/transactor/LaunchFundingCyclesTx'
import omit from 'lodash/omit'
import { JBPayDataSourceFundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import {
  DEFAULT_MUST_START_AT_OR_AFTER,
  NftRewardsData,
} from 'redux/slices/editingV2Project'
import {
  buildJB721TierParams,
  buildJBDeployTiered721DelegateData,
  findJBTiered721DelegateStoreAddress,
} from 'utils/nftRewards'
import {
  getTerminalsFromFundAccessConstraints,
  isValidMustStartAtOrAfter,
} from 'utils/v2v3/fundingCycle'
import { useV2ProjectTitle } from '../../v2v3/ProjectTitle'

const DEFAULT_MEMO = ''

interface LaunchFundingCyclesWithNftsTxArgs {
  projectId: number
  tiered721DelegateData: NftRewardsData
  launchFundingCyclesData: LaunchFundingCyclesData
}

export function useLaunchFundingCyclesWithNftsTx(): TransactorInstance<LaunchFundingCyclesWithNftsTxArgs> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

  const projectTitle = useV2ProjectTitle()

  return async (
    {
      projectId,
      tiered721DelegateData: { rewardTiers, CIDs, collectionMetadata },
      launchFundingCyclesData: {
        fundingCycleData,
        fundingCycleMetadata,
        fundAccessConstraints,
        groupedSplits = [],
        mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
      },
    },
    txOpts,
  ) => {
    const JBTiered721DelegateStoreAddress =
      await findJBTiered721DelegateStoreAddress()
    const collectionName = collectionMetadata.name

    if (
      !transactor ||
      !projectOwnerAddress ||
      !contracts ||
      !JBTiered721DelegateStoreAddress ||
      !isValidMustStartAtOrAfter(
        mustStartAtOrAfter,
        fundingCycleData.duration,
      ) ||
      !collectionName ||
      !CIDs ||
      !rewardTiers
    ) {
      const missingParam = !transactor
        ? 'transactor'
        : !projectOwnerAddress
        ? 'projectOwnerAddress'
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
    const tiers = buildJB721TierParams({ cids: CIDs, rewardTiers })

    const delegateData = buildJBDeployTiered721DelegateData({
      collectionUri: collectionMetadata.uri ?? '',
      collectionName,
      collectionSymbol: collectionMetadata.symbol ?? '',
      tiers,
      ownerAddress: projectOwnerAddress,
      contractAddresses: {
        JBDirectoryAddress: getAddress(contracts.JBDirectory.address),
        JBFundingCycleStoreAddress: getAddress(
          contracts.JBFundingCycleStore.address,
        ),
        JBPricesAddress: getAddress(contracts.JBPrices.address),
        JBTiered721DelegateStoreAddress,
      },
    })

    // NFT launch tx does not accept `useDataSourceForPay` and `dataSource` (see contracts:`JBPayDataSourceFundingCycleMetadata`)
    const dataSourceFCMetadata: JBPayDataSourceFundingCycleMetadata = omit(
      fundingCycleMetadata,
      ['useDataSourceForPay', 'dataSource'],
    )

    const launchFundingCyclesDataArg = {
      data: fundingCycleData,
      metadata: dataSourceFCMetadata,
      mustStartAtOrAfter,
      groupedSplits,
      fundAccessConstraints,
      terminals: getTerminalsFromFundAccessConstraints(fundAccessConstraints),
      memo: DEFAULT_MEMO,
    }

    const args = [
      projectId,
      delegateData, // _deployTiered721DelegateData
      launchFundingCyclesDataArg, // _launchFundingCyclesData
    ]

    return transactor(
      contracts.JBTiered721DelegateProjectDeployer,
      'launchFundingCyclesFor',
      args,
      {
        ...txOpts,
        title: t`Launch funding cycles for ${projectTitle}`,
      },
    )
  }
}
