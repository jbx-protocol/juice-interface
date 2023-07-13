import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { useIsUserAddress } from 'hooks/useIsUserAddress'
import { useWalletSignIn } from 'hooks/useWalletSignIn'
import { useCallback, useContext, useEffect, useState } from 'react'
import { UpdatesPanelContext } from '../components/UpdatesPanelProvider'

export type ProjectUpdate = {
  id: string
  title: string
  message: string
  imageUrl: string | undefined
  createdAt: Date
  posterWallet: string
}

export const useUpdatesPanel = () => {
  const { projectOwnerAddress } = useProjectContext()
  const isProjectOwner = useIsUserAddress(projectOwnerAddress)
  const signIn = useWalletSignIn()
  const { loadProjectUpdates, ...projectUpdates } =
    useContext(UpdatesPanelContext)

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

  useEffect(() => {
    loadProjectUpdates()
  }, [loadProjectUpdates])

  return {
    loading: projectUpdates.loading,
    error: projectUpdates.error,
    projectUpdates: projectUpdates.projectUpdates,
    open,
    isProjectOwner,
    addProjectUpdateButtonLoading,
    setOpen,
    handleAddProjectUpdateClicked,
  }
}
