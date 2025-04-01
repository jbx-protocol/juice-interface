import { JBChainId } from 'juice-sdk-react'
import {
  LaunchTxOpts,
  useLaunchProjectTx,
} from 'packages/v4/hooks/useLaunchProjectTx'
import { useCallback } from 'react'
import { useStandardProjectLaunchData } from './useStandardProjectLaunchData'
/**
 * Hook that returns a function that deploys a v4 project.
 *
 * Takes data from the redux store built for v2v3 projects, data is converted to v4 format in useLaunchProjectTx.
 * @returns A function that deploys a project.
 */
export const useDeployStandardProject = () => {
  const launchProjectTx = useLaunchProjectTx()
  const getLaunchData = useStandardProjectLaunchData()

  const deployStandardProjectCallback = useCallback(
    async ({
      chainId,
      metadataCid,
      onTransactionPending,
      onTransactionConfirmed,
      onTransactionError,
    }: {
      chainId: JBChainId
      metadataCid: string
    } & LaunchTxOpts) => {
      const { args, controllerAddress } = getLaunchData({
        projectMetadataCID: metadataCid,
        chainId: chainId as JBChainId,
      })

      return await launchProjectTx(
        args,
        controllerAddress,
        chainId as JBChainId,
        {
          onTransactionPending,
          onTransactionConfirmed,
          onTransactionError,
        },
      )
    },
    [getLaunchData, launchProjectTx],
  )

  return deployStandardProjectCallback
}
