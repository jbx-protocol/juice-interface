import { MinusIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import axios from 'axios'
import EthereumAddress from 'components/EthereumAddress'
import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { emitConfirmationDeletionModal } from 'components/ProjectDashboard/utils/modals'
import { useIsUserAddress } from 'hooks/useIsUserAddress'
import { useWalletSignIn } from 'hooks/useWalletSignIn'
import { useCallback, useContext, useMemo } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { PopupMenu } from '../../PopupMenu/PopupMenu'
import { ProjectUpdate as ProjectUpdateEntity } from '../../ProjectUpdatesProvider'
import { ProjectUpdatesContext } from '../../ProjectUpdatesProvider/ProjectUpdatesProvider'
import { useFactoredProjectId } from '../hooks/useFactoredProjectId'
import { formatDateString } from '../utils/formatDateString'

export const ProjectUpdate = ({
  id,
  title,
  createdAt,
  imageUrl,
  message,
  posterWallet,
}: ProjectUpdateEntity) => {
  const { loadProjectUpdates } = useContext(ProjectUpdatesContext)
  const projectId = useFactoredProjectId()
  const signIn = useWalletSignIn()
  const { projectOwnerAddress } = useProjectContext()
  const isProjectOwner = useIsUserAddress(projectOwnerAddress)

  const subtitle = useMemo(() => {
    const dateString = formatDateString(createdAt)
    return (
      <Trans>
        Posted {dateString} by <EthereumAddress address={posterWallet} />
      </Trans>
    )
  }, [createdAt, posterWallet])

  const handleUpdateDelete = useCallback(async () => {
    try {
      await axios.delete(`/api/projects/${projectId}/updates/${id}`)
      loadProjectUpdates()
    } catch (error) {
      console.error(error)
      emitErrorNotification('Could not delete update')
    }
  }, [id, loadProjectUpdates, projectId])

  const handleDeleteProjectUpdateClicked = useCallback(async () => {
    try {
      await signIn()
      emitConfirmationDeletionModal({
        type: 'Update',
        onConfirm: handleUpdateDelete,
      })
    } catch (error) {
      console.error(error)
      emitErrorNotification('Could not delete update')
    }
  }, [handleUpdateDelete, signIn])

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-grey-200 py-6 px-5 shadow-md dark:border-slate-600">
      <div className="flex justify-between">
        <div className="font-heading text-xl font-medium">{title}</div>
        {isProjectOwner && (
          <PopupMenu
            items={[
              {
                id: 'delete-update',
                label: (
                  <>
                    <MinusIcon className="h-5 w-5 text-error-500" />
                    <span className="whitespace-nowrap text-error-500">
                      <Trans>Delete project update</Trans>
                    </span>
                  </>
                ),
                onClick: handleDeleteProjectUpdateClicked,
              },
            ]}
          />
        )}
      </div>
      <span className="text-xs text-grey-500 dark:text-slate-200">
        {subtitle}
      </span>
      <div>
        {message.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {imageUrl && (
        <JuiceVideoThumbnailOrImage
          className="max-h-[288px]"
          src={imageUrl}
          alt={title}
        />
      )}
    </div>
  )
}

export const ProjectUpdateSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-grey-200 py-6 px-5 shadow-md dark:border-slate-600">
      <div className="flex justify-between">
        <div className="flex h-5 w-[80%] animate-pulse rounded-md bg-grey-200" />
      </div>
      <span className="h-4 w-[40%] animate-pulse rounded-md bg-grey-200" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-full animate-pulse rounded-md bg-grey-200" />
        <div className="h-4 w-[80%] animate-pulse rounded-md bg-grey-200" />
        <div className="h-4 w-[72%] animate-pulse rounded-md bg-grey-200" />
        <div className="h-4 w-full animate-pulse rounded-md bg-grey-200" />
      </div>
    </div>
  )
}
