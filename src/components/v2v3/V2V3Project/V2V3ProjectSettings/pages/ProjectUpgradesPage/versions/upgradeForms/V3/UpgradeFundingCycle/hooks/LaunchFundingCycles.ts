import { useIsNftProject } from 'components/Create/hooks/DeployProject/hooks'
import { EditingFundingCycleConfig } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ReconfigureFundingCycleSettingsPage/hooks/editingFundingCycleConfig'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { revalidateProject } from 'lib/api/nextjs'
import { PV2 } from 'models/pv'
import { useCallback, useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { reloadWindow } from 'utils/windowUtils'
import { useLaunchNftFundingCycles } from './LaunchNftFundingCycle'
import { useLaunchStandardFundingCycles } from './LaunchStandardFundingCycle'

export const useLaunchFundingCycles = ({
  editingFundingCycleConfig,
}: {
  editingFundingCycleConfig: EditingFundingCycleConfig
}) => {
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const [launchFundingCycleTxLoading, setLaunchFundingCycleTxLoading] =
    useState<boolean>(false)
  const launchStandardFundingCycles = useLaunchStandardFundingCycles(
    editingFundingCycleConfig,
  )
  const launchNftFundingCycles = useLaunchNftFundingCycles(
    editingFundingCycleConfig,
  )

  const isNftFundingCycle = useIsNftProject()

  const launchFundingCycle = useCallback(async () => {
    setLaunchFundingCycleTxLoading(true)

    const callbacks = {
      onConfirmed() {
        setLaunchFundingCycleTxLoading(false)

        if (projectId) {
          revalidateProject({
            pv: pv as PV2,
            projectId: String(projectId),
          })
        }

        // reload window to force-reflect latest changes
        reloadWindow()
      },
    }

    const txSuccessful = isNftFundingCycle
      ? await launchNftFundingCycles(callbacks)
      : await launchStandardFundingCycles(callbacks)

    if (!txSuccessful) {
      setLaunchFundingCycleTxLoading(false)
      emitErrorNotification('Failed to launch cycles.')
    }
  }, [
    launchStandardFundingCycles,
    launchNftFundingCycles,
    isNftFundingCycle,
    projectId,
    pv,
  ])

  return {
    launchFundingCycleLoading: launchFundingCycleTxLoading,
    launchFundingCycle,
  }
}
