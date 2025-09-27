import {
  DEFAULT_MEMO,
  JBChainId,
  NATIVE_TOKEN,
  jbContractAddress,
  JBCoreContracts,
} from 'juice-sdk-core'
import {
  LaunchV2V3ProjectArgs,
  transformV2V3CreateArgsToV4,
} from 'packages/v4/utils/launchProjectTransformers'
import {
  useCreatingV2V3FundAccessConstraintsSelector,
  useCreatingV2V3FundingCycleDataSelector,
  useCreatingV2V3FundingCycleMetadataSelector,
} from 'redux/hooks/v2v3/create'

import { Address } from 'viem'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useWallet } from 'hooks/Wallet'

/**
 * Hook that returns a function that deploys a v4 project.
 *
 * Takes  data from the redux store built for v2v3 projects, data is converted to v4 format in useLaunchProjectTx.
 */
export function useStandardProjectLaunchData() {
  const {
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
    mustStartAtOrAfter,
    inputProjectOwner,
  } = useAppSelector(state => state.creatingV2Project)
  const fundingCycleMetadata = useCreatingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useCreatingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useCreatingV2V3FundAccessConstraintsSelector()
  const { userAddress } = useWallet()

  return ({
    projectMetadataCID,
    chainId,
    /**
     * Add a x minute buffer to the start time of the project.
     */
    withStartBuffer,
  }: {
    projectMetadataCID: string
    chainId: JBChainId
    withStartBuffer?: boolean
  }) => {
    const terminalAddress = chainId
      ? (jbContractAddress['4'][JBCoreContracts.JBMultiTerminal][
          chainId as JBChainId
        ] as Address)
      : undefined

    if (!terminalAddress) {
      throw new Error('No terminal address found for chain: ' + chainId)
    }

    const controllerAddress = chainId
      ? (jbContractAddress['4'][JBCoreContracts.JBController][
          chainId as JBChainId
        ] as Address)
      : undefined

    const groupedSplits = [payoutGroupedSplits, reservedTokensGroupedSplits]

    const _owner =
      inputProjectOwner && inputProjectOwner.length
        ? inputProjectOwner
        : userAddress

    const _mustStartAtOrAfter = withStartBuffer
      ? mustStartAtOrAfter + 60 * 5 // 5 minutes
      : mustStartAtOrAfter

    const v2v3Args = [
      _owner,
      [projectMetadataCID, JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN],
      fundingCycleData,
      fundingCycleMetadata,
      _mustStartAtOrAfter,
      groupedSplits,
      fundAccessConstraints,
      [terminalAddress], // _terminals, just supporting single for now
      // Eventually should be something like:
      //    getTerminalsFromFundAccessConstraints(
      //      fundAccessConstraints,
      //      contracts.primaryNativeTerminal.data,
      //    ),
      DEFAULT_MEMO,
    ] as LaunchV2V3ProjectArgs

    const args = transformV2V3CreateArgsToV4({
      v2v3Args,
      primaryNativeTerminal: terminalAddress,
      currencyTokenAddress: NATIVE_TOKEN,
    })

    return { args, controllerAddress }
  }
}
