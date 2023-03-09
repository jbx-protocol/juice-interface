import { getAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useDefaultJBETHPaymentTerminal } from 'hooks/defaultContracts/DefaultJBETHPaymentTerminal'
import { TransactorInstance } from 'hooks/Transactor'
import { LaunchProjectData } from 'hooks/v2v3/transactor/LaunchProjectTx'
import { useWallet } from 'hooks/Wallet'
import omit from 'lodash/omit'
import {
  JB721GovernanceType,
  JB721TierParams,
  JBTiered721Flags,
} from 'models/nftRewards'
import { JBPayDataSourceFundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { buildJBDeployTiered721DelegateData } from 'utils/nftRewards'
import {
  getTerminalsFromFundAccessConstraints,
  isValidMustStartAtOrAfter,
} from 'utils/v2v3/fundingCycle'
import { useV2ProjectTitle } from '../../v2v3/ProjectTitle'
import { findDefaultJBTiered721DelegateStoreAddress } from '../contracts/JBTiered721DelegateProjectDeployer'

interface DeployTiered721DelegateData {
  collectionUri: string
  collectionName: string
  collectionSymbol: string
  governanceType: JB721GovernanceType
  tiers: JB721TierParams[]
  flags: JBTiered721Flags
}

interface LaunchProjectWithNftsTxArgs {
  tiered721DelegateData: DeployTiered721DelegateData
  projectData: LaunchProjectData
}

export function useLaunchProjectWithNftsTx(): TransactorInstance<LaunchProjectWithNftsTxArgs> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)

  const { userAddress } = useWallet()
  const projectTitle = useV2ProjectTitle()
  const defaultJBETHPaymentTerminal = useDefaultJBETHPaymentTerminal()

  return async (
    {
      tiered721DelegateData: {
        collectionUri,
        collectionName,
        collectionSymbol,
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
    const JBTiered721DelegateStoreAddress =
      await findDefaultJBTiered721DelegateStoreAddress()

    if (
      !transactor ||
      !userAddress ||
      !contracts ||
      !defaultJBETHPaymentTerminal ||
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
    const _owner = owner?.length ? owner : userAddress

    const delegateData = buildJBDeployTiered721DelegateData({
      collectionUri,
      collectionName,
      collectionSymbol,
      tiers,
      ownerAddress: _owner,
      governanceType,
      contractAddresses: {
        JBDirectoryAddress: getAddress(contracts.JBDirectory.address),
        JBFundingCycleStoreAddress: getAddress(
          contracts.JBFundingCycleStore.address,
        ),
        JBPricesAddress: getAddress(contracts.JBPrices.address),
        JBTiered721DelegateStoreAddress,
      },
      flags,
    })

    // NFT launch tx does not accept `useDataSourceForPay` and `dataSource` (see contracts:`JBPayDataSourceFundingCycleMetadata`)
    const dataSourceFCMetadata: JBPayDataSourceFundingCycleMetadata = omit(
      fundingCycleMetadata,
      ['useDataSourceForPay', 'dataSource'],
    )

    const args = [
      _owner, // _owner
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
        terminals: getTerminalsFromFundAccessConstraints(
          fundAccessConstraints,
          defaultJBETHPaymentTerminal?.address,
        ),
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
