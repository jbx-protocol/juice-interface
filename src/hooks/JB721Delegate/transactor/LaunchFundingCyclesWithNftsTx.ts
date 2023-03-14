import { t } from '@lingui/macro'
import { CV_V3 } from 'constants/cv'
import {
  JB721_DELEGATE_V1,
  JB721_DELEGATE_V1_1,
} from 'constants/delegateVersions'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useDefaultJBETHPaymentTerminal } from 'hooks/defaultContracts/DefaultJBETHPaymentTerminal'
import { TransactorInstance } from 'hooks/Transactor'
import { useLoadV2V3Contract } from 'hooks/v2v3/LoadV2V3Contract'
import { LaunchFundingCyclesData } from 'hooks/v2v3/transactor/LaunchFundingCyclesTx'
import { JB_CONTROLLER_V_3_1 } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectController'
import omit from 'lodash/omit'
import {
  JB721DelegateVersion,
  JBDeployTiered721DelegateData,
  JB_DEPLOY_TIERED_721_DELEGATE_DATA_V1_1,
} from 'models/nftRewards'
import { GroupedSplits, SplitGroup } from 'models/splits'
import { V2V3ContractName } from 'models/v2v3/contracts'
import {
  JBPayDataSourceFundingCycleMetadata,
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { NftRewardsData } from 'redux/slices/editingV2Project/types'
import {
  buildDeployTiered721DelegateData,
  buildJB721TierParams,
} from 'utils/nftRewards'
import {
  getTerminalsFromFundAccessConstraints,
  isValidMustStartAtOrAfter,
} from 'utils/v2v3/fundingCycle'
import { useV2ProjectTitle } from '../../v2v3/ProjectTitle'
import {
  DEFAULT_JB_721_DELEGATE_VERSION,
  findDefaultJBTiered721DelegateStoreAddress,
} from '../contracts/JBTiered721DelegateProjectDeployer'

interface LaunchFundingCyclesWithNftsTxArgs {
  projectId: number
  tiered721DelegateData: NftRewardsData
  launchFundingCyclesData: LaunchFundingCyclesData
}

export interface JB721DelegateLaunchFundingCycleData {
  data: V2V3FundingCycleData
  metadata: JBPayDataSourceFundingCycleMetadata
  memo?: string
  fundAccessConstraints: V2V3FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
  terminals: string[]
}

function buildArgs(
  version: JB721DelegateVersion,
  {
    projectId,
    deployTiered721DelegateData,
    launchFundingCyclesData,
    JBControllerAddress,
  }: {
    projectId: number
    JBControllerAddress: string
    deployTiered721DelegateData:
      | JBDeployTiered721DelegateData
      | JB_DEPLOY_TIERED_721_DELEGATE_DATA_V1_1
    launchFundingCyclesData: JB721DelegateLaunchFundingCycleData
  },
) {
  const baseArgs = [
    projectId,
    deployTiered721DelegateData, //_deployTiered721DelegateData
    launchFundingCyclesData, // _launchFundingCyclesData
  ]

  if (version === JB721_DELEGATE_V1) {
    return baseArgs
  }
  if (version === JB721_DELEGATE_V1_1) {
    return [...baseArgs, JBControllerAddress] // v1.1 requires us to pass the controller address in
  }
}

export function useLaunchFundingCyclesWithNftsTx(): TransactorInstance<LaunchFundingCyclesWithNftsTxArgs> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const {
    contracts: { JBController },
    versions,
  } = useContext(V2V3ProjectContractsContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

  const projectTitle = useV2ProjectTitle()
  const V3JBDirectory = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBDirectory,
  })
  const V3JBFundingCycleStore = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBFundingCycleStore,
  })
  const V3JBPrices = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBPrices,
  })
  const defaultJBETHPaymentTerminal = useDefaultJBETHPaymentTerminal()

  return async (
    {
      projectId,
      tiered721DelegateData: {
        governanceType,
        rewardTiers,
        CIDs,
        collectionMetadata,
        flags,
      },
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
      await findDefaultJBTiered721DelegateStoreAddress()
    const collectionName = collectionMetadata.name

    const contractsLoaded =
      contracts &&
      V3JBDirectory &&
      V3JBFundingCycleStore &&
      V3JBPrices &&
      JBTiered721DelegateStoreAddress &&
      defaultJBETHPaymentTerminal &&
      JBController

    if (
      !transactor ||
      !projectOwnerAddress ||
      !isValidMustStartAtOrAfter(
        mustStartAtOrAfter,
        fundingCycleData.duration,
      ) ||
      !collectionName ||
      !CIDs ||
      !rewardTiers ||
      !contractsLoaded
    ) {
      const missingParam = !transactor
        ? 'transactor'
        : !projectOwnerAddress
        ? 'projectOwnerAddress'
        : !contractsLoaded
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
    const tiers = buildJB721TierParams({
      cids: CIDs,
      rewardTiers,
      version: DEFAULT_JB_721_DELEGATE_VERSION,
    })

    const deployTiered721DelegateData = buildDeployTiered721DelegateData({
      collectionUri: collectionMetadata.uri ?? '',
      collectionName,
      collectionSymbol: collectionMetadata.symbol ?? '',
      governanceType,
      tiers,
      ownerAddress: projectOwnerAddress,
      contractAddresses: {
        JBDirectoryAddress: V3JBDirectory.address,
        JBFundingCycleStoreAddress: V3JBFundingCycleStore.address,
        JBPricesAddress: V3JBPrices.address,
        JBTiered721DelegateStoreAddress,
      },
      flags,
    })

    // NFT launch tx does not accept `useDataSourceForPay` and `dataSource` (see contracts:`JBPayDataSourceFundingCycleMetadata`)
    const dataSourceFCMetadata: JBPayDataSourceFundingCycleMetadata = omit(
      fundingCycleMetadata,
      ['useDataSourceForPay', 'dataSource'],
    )

    const launchFundingCyclesData: JB721DelegateLaunchFundingCycleData = {
      data: fundingCycleData,
      metadata: dataSourceFCMetadata,
      mustStartAtOrAfter,
      groupedSplits,
      fundAccessConstraints,
      terminals: getTerminalsFromFundAccessConstraints(
        fundAccessConstraints,
        defaultJBETHPaymentTerminal?.address,
      ),
      memo: DEFAULT_MEMO,
    }

    const args = buildArgs(
      versions.JBControllerVersion === JB_CONTROLLER_V_3_1
        ? JB721_DELEGATE_V1_1 // use delegate v1.1 for controller v3.1
        : JB721_DELEGATE_V1,
      {
        projectId,
        deployTiered721DelegateData,
        launchFundingCyclesData,
        JBControllerAddress: JBController.address,
      },
    )

    if (!args) {
      txOpts?.onError?.(
        new DOMException(`Transaction failed, failed to build args`),
      )

      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBTiered721DelegateProjectDeployer,
      'launchFundingCyclesFor',
      args,
      {
        ...txOpts,
        title: t`Launch cycles for ${projectTitle}`,
      },
    )
  }
}
