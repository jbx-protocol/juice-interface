import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useIsUserAddress } from 'hooks/useIsUserAddress'
import { useWalletSignIn } from 'hooks/useWalletSignIn'
import { useCallback, useContext, useState } from 'react'
import { ProjectUpdatesContext } from '../../ProjectUpdatesProvider/ProjectUpdatesProvider'

export const useUpdatesPanel = () => {
  const { projectOwnerAddress } = useProjectContext()
  const isProjectOwner = useIsUserAddress(projectOwnerAddress)
  const signIn = useWalletSignIn()
  const projectUpdates = useContext(ProjectUpdatesContext)

  const [addProjectUpdateButtonLoading, setAddProjectUpdateButtonLoading] =
    useState(false)
  const [open, setOpen] = useState(false)

  const handleAddProjectUpdateClicked = useCallback(async () => {
    setAddProjectUpdateButtonLoading(true)
    try {
      await signIn()
      setOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      setAddProjectUpdateButtonLoading(false)
    }
  }, [signIn])

  return {
    loading: projectUpdates.loading,
    error: projectUpdates.error,
    projectUpdates: projectUpdates.projectUpdates,
    loadProjectUpdates: projectUpdates.loadProjectUpdates,
    open,
    isProjectOwner,
    addProjectUpdateButtonLoading,
    setOpen,
    handleAddProjectUpdateClicked,
  }
}
