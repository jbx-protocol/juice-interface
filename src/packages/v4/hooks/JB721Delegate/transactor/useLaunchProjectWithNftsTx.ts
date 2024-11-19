import {
  JBDeployTiered721DelegateData,
  JB_DEPLOY_TIERED_721_DELEGATE_DATA_V3_1
} from 'models/nftRewards'
import { JB721DelegateLaunchProjectData, JBDeploy721TiersHookConfig, LaunchProjectWithNftsTxArgs } from 'packages/v4/models/nfts'

import { TransactorInstance } from 'hooks/useTransactor'
import { useWallet } from 'hooks/Wallet'
import { useJBContractContext } from 'juice-sdk-react'
import { DEFAULT_JB_721_DELEGATE_VERSION } from 'packages/v2v3/hooks/defaultContracts/useDefaultJB721Delegate'
import { useDefaultJBController } from 'packages/v2v3/hooks/defaultContracts/useDefaultJBController'
import { useDefaultJBETHPaymentTerminal } from 'packages/v2v3/hooks/defaultContracts/useDefaultJBETHPaymentTerminal'
import { useV2ProjectTitle } from 'packages/v2v3/hooks/useProjectTitle'
import {
  isValidMustStartAtOrAfter
} from 'packages/v2v3/utils/fundingCycle'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { useJB721DelegateContractAddress } from '../contracts/useJB721DelegateContractAddress'
import { useJBTiered721DelegateProjectDeployer } from '../contracts/useJBTiered721DelegateProjectDeployer'

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
  const { contracts } = useJBContractContext()
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
      !userAddress ||
      !contracts ||
      !defaultJBController ||
      !defaultJBETHPaymentTerminal ||
      !JBTiered721DelegateProjectDeployer ||
      !JBTiered721DelegateStoreAddress ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      const missingParam = !userAddress
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

    const deployTiered721DelegateData: JBDeploy721TiersHookConfig = {
      name: collectionName,
      symbol: collectionSymbol,
      baseUri: '', // ?
      tokenUriResolver: '', // ?
      contractUri: '', //collectionUri ;
      tiersConfig: tiers,
      reserveBeneficiary: '', //?;
      flags,
    }

    // NFT launch tx does not accept `useDataHookForPay` and `dataHook` (see contracts:`JBPayDataHookRulesetMetadata`)
    // const dataHookRulesetMetadata: JBPayDataHookRulesetMetadata = omit(
    //   rulesetMetadata,
    //   ['useDataSourceForPay', 'dataSource'],
    // )

    // const launchProjectData: JB721DelegateLaunchProjectData = {
    //   projectMetadata: {
    //     domain: JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN,
    //     content: projectMetadataCID,
    //   },
    //   data: fundingCycleData,
    //   metadata: dataHookRulesetMetadata,
    //   mustStartAtOrAfter,
    //   groupedSplits,
    //   fundAccessConstraints,
    //   terminals: [defaultJBETHPaymentTerminal?.address],
    //   memo: DEFAULT_MEMO,
    // } // _launchProjectData

    // const args = buildArgs({
    //   owner: _owner,
    //   deployTiered721DelegateData,
    //   launchProjectData: transformV2V3CreateArgsToV4(launchProjectData),
    //   JBControllerAddress: defaultJBController.address,
    // })

    // if (!args) {
    //   txOpts?.onError?.(
    //     new DOMException(`Transaction failed, failed to build args`),
    //   )

    //   return Promise.resolve(false)
    // }

    // return transactor(
    //   JBTiered721DelegateProjectDeployer,
    //   'launchProjectFor',
    //   args,
    //   {
    //     ...txOpts,
    //     title: t`Launch ${projectTitle}`,
    //   },
    // )
    return Promise.resolve(false)
  }
}
