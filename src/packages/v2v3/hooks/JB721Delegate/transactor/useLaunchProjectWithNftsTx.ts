import { t } from '@lingui/macro'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { getAddress } from 'ethers/lib/utils'
import { useWallet } from 'hooks/Wallet'
import { TransactorInstance } from 'hooks/useTransactor'
import omit from 'lodash/omit'
import {
  JB721GovernanceType,
  JB721TierParams,
  JBDeployTiered721DelegateData,
  JBTiered721Flags,
  JB_721_TIER_PARAMS_V3_1,
  JB_721_TIER_PARAMS_V3_2,
  JB_DEPLOY_TIERED_721_DELEGATE_DATA_V3_1,
} from 'models/nftRewards'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { useJBPrices } from 'packages/v2v3/hooks/JBPrices'
import { DEFAULT_JB_721_DELEGATE_VERSION } from 'packages/v2v3/hooks/defaultContracts/useDefaultJB721Delegate'
import { useDefaultJBController } from 'packages/v2v3/hooks/defaultContracts/useDefaultJBController'
import { useDefaultJBETHPaymentTerminal } from 'packages/v2v3/hooks/defaultContracts/useDefaultJBETHPaymentTerminal'
import { LaunchV2V3ProjectData } from 'packages/v2v3/hooks/transactor/useLaunchProjectTx'
import { useV2ProjectTitle } from 'packages/v2v3/hooks/useProjectTitle'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import {
  JBPayDataSourceFundingCycleMetadata,
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
} from 'packages/v2v3/models/fundingCycle'
import { GroupedSplits, SplitGroup } from 'packages/v2v3/models/splits'
import {
  isValidMustStartAtOrAfter
} from 'packages/v2v3/utils/fundingCycle'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { buildDeployTiered721DelegateData } from 'utils/nftRewards'
import { useJB721DelegateContractAddress } from '../contracts/useJB721DelegateContractAddress'
import { useJBTiered721DelegateProjectDeployer } from '../contracts/useJBTiered721DelegateProjectDeployer'

interface DeployTiered721DelegateData {
  collectionUri: string
  collectionName: string
  collectionSymbol: string
  currency: V2V3CurrencyOption
  governanceType: JB721GovernanceType
  tiers: (JB721TierParams | JB_721_TIER_PARAMS_V3_1 | JB_721_TIER_PARAMS_V3_2)[]
  flags: JBTiered721Flags
}

interface JB721DelegateLaunchFundingCycleData {
  data: V2V3FundingCycleData
  metadata: JBPayDataSourceFundingCycleMetadata
  memo?: string
  fundAccessConstraints: V2V3FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
  terminals: string[]
}

interface LaunchProjectWithNftsTxArgs {
  tiered721DelegateData: DeployTiered721DelegateData
  projectData: LaunchV2V3ProjectData
}

type JB721DelegateLaunchProjectData = JB721DelegateLaunchFundingCycleData & {
  projectMetadata: {
    domain: number
    content: string
  }
}

function buildArgs({
  owner,
  deployTiered721DelegateData,
  launchProjectData,
  JBControllerAddress,
}: {
  owner: string
  JBControllerAddress: string
  deployTiered721DelegateData:
    | JBDeployTiered721DelegateData
    | JB_DEPLOY_TIERED_721_DELEGATE_DATA_V3_1
  launchProjectData: JB721DelegateLaunchProjectData
}) {
  const baseArgs = [
    owner,
    deployTiered721DelegateData, //_deployTiered721DelegateData
    launchProjectData, // _launchProjectData
  ]

  return [...baseArgs, JBControllerAddress]
}

export function useLaunchProjectWithNftsTx(): TransactorInstance<LaunchProjectWithNftsTxArgs> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const defaultJBController = useDefaultJBController()

  const { userAddress } = useWallet()
  const projectTitle = useV2ProjectTitle()
  const defaultJBETHPaymentTerminal = useDefaultJBETHPaymentTerminal()
  const JBTiered721DelegateProjectDeployer =
    useJBTiered721DelegateProjectDeployer({
      version: DEFAULT_JB_721_DELEGATE_VERSION,
    })
  const JBTiered721DelegateStoreAddress = useJB721DelegateContractAddress({
    contractName: 'JBTiered721DelegateStore',
    version: DEFAULT_JB_721_DELEGATE_VERSION,
  })
  const JBPrices = useJBPrices()

  return async (
    {
      tiered721DelegateData: {
        collectionUri,
        collectionName,
        collectionSymbol,
        currency,
        tiers,
        flags,
        governanceType,
      },
      projectData: {
        projectMetadataCID,
        fundingCycleData,
        fundingCycleMetadata,
        fundAccessConstraints,
        groupedSplits = [],
        mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
        owner,
      },
    },
    txOpts,
  ) => {
    if (
      !transactor ||
      !userAddress ||
      !contracts ||
      !defaultJBController ||
      !defaultJBETHPaymentTerminal ||
      !JBTiered721DelegateProjectDeployer ||
      !JBTiered721DelegateStoreAddress ||
      !JBPrices ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      const missingParam = !transactor
        ? 'transactor'
        : !userAddress
        ? 'userAddress'
        : !contracts
        ? 'contracts'
        : !defaultJBController
        ? 'defaultJBController'
        : !JBTiered721DelegateStoreAddress
        ? 'JBTiered721DelegateStoreAddress'
        : !JBTiered721DelegateProjectDeployer
        ? 'JBTiered721DelegateProjectDeployer'
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
    const _owner = owner?.length ? owner : userAddress

    const deployTiered721DelegateData = buildDeployTiered721DelegateData(
      {
        collectionUri,
        collectionName,
        collectionSymbol,
        currency,
        tiers,
        ownerAddress: _owner,
        governanceType,
        contractAddresses: {
          JBDirectoryAddress: getAddress(contracts.JBDirectory.address),
          JBFundingCycleStoreAddress: getAddress(
            contracts.JBFundingCycleStore.address,
          ),
          JBPricesAddress: getAddress(JBPrices.address),
          JBTiered721DelegateStoreAddress,
        },
        flags,
      },
      DEFAULT_JB_721_DELEGATE_VERSION,
    )

    // NFT launch tx does not accept `useDataSourceForPay` and `dataSource` (see contracts:`JBPayDataSourceFundingCycleMetadata`)
    const dataSourceFCMetadata: JBPayDataSourceFundingCycleMetadata = omit(
      fundingCycleMetadata,
      ['useDataSourceForPay', 'dataSource'],
    )

    const launchProjectData: JB721DelegateLaunchProjectData = {
      projectMetadata: {
        domain: JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN,
        content: projectMetadataCID,
      },
      data: fundingCycleData,
      metadata: dataSourceFCMetadata,
      mustStartAtOrAfter,
      groupedSplits,
      fundAccessConstraints,
      terminals: [defaultJBETHPaymentTerminal?.address],
      memo: DEFAULT_MEMO,
    } // _launchProjectData

    const args = buildArgs({
      owner: _owner,
      deployTiered721DelegateData,
      launchProjectData,
      JBControllerAddress: defaultJBController.address,
    })

    if (!args) {
      txOpts?.onError?.(
        new DOMException(`Transaction failed, failed to build args`),
      )

      return Promise.resolve(false)
    }

    return transactor(
      JBTiered721DelegateProjectDeployer,
      'launchProjectFor',
      args,
      {
        ...txOpts,
        title: t`Launch ${projectTitle}`,
      },
    )
  }
}
