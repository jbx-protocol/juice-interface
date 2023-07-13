import { PlusIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import { AddProjectUpdateModal } from '../AddProjectUpdateModal'
import { EmptyScreen } from '../EmptyScreen'
import { PopupMenu } from '../PopupMenu/PopupMenu'
import {
  ProjectUpdate,
  ProjectUpdateSkeleton,
} from './components/ProjectUpdate'
import { UpdatesPanelProvider } from './components/UpdatesPanelProvider'
import { useUpdatesPanel } from './hooks/useUpdatesPanel'

const _UpdatesPanel = () => {
  const { loading, projectUpdates, error, open, isProjectOwner, setOpen } =
    useUpdatesPanel()

  const containerClassName =
    'flex w-full flex-col items-center gap-6 md:max-w-[596px]'

  if (!projectUpdates.length && loading) {
    return (
      <div className={containerClassName}>
        <div className="flex w-full">
          <span className="text-start font-heading text-2xl font-medium">
            <Trans>Project Updates</Trans>
          </span>
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <ProjectUpdateSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (!projectUpdates.length && !loading) {
    return (
      <div className={containerClassName}>
        <EmptyState />
      </div>
    )
  }

  return (
    <>
      <div className="flex w-full flex-col items-center gap-6 md:max-w-[596px]">
        <div className="flex w-full justify-between gap-5">
          <span className="text-start font-heading text-2xl font-medium">
            <Trans>Project Updates</Trans>
          </span>
          {isProjectOwner && (
            <PopupMenu
              items={[
                {
                  id: 'add-update',
                  label: (
                    <>
                      <PlusIcon className="h-5 w-5" />
                      <span className="whitespace-nowrap">
                        <Trans>Add project update</Trans>
                      </span>
                    </>
                  ),
                  onClick: () => setOpen(true),
                },
              ]}
            />
          )}
        </div>
        {projectUpdates.map(u => (
          <ProjectUpdate key={u.id} {...u} />
        ))}
      </div>
      {error && <div className="text-error-500">{error}</div>}
      <AddProjectUpdateModal open={open} setOpen={setOpen} />
    </>
  )
}

const EmptyState = () => {
  const {
    addProjectUpdateButtonLoading,
    isProjectOwner,
    handleAddProjectUpdateClicked,
  } = useUpdatesPanel()

  const emptyScreenMessage = isProjectOwner
    ? t`Your project has no updates`
    : t`This project has no updates`

  return (
    <>
      <EmptyScreen title={emptyScreenMessage} />
      {isProjectOwner && (
        <Button
          className="flex w-fit items-center gap-2"
          type="primary"
          loading={addProjectUpdateButtonLoading}
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={handleAddProjectUpdateClicked}
        >
          <Trans>Add project update</Trans>
        </Button>
      )}
    </>
  )
}

export const UpdatesPanel = () => {
  return (
    <UpdatesPanelProvider>
      <_UpdatesPanel />
    </UpdatesPanelProvider>
  )
}
