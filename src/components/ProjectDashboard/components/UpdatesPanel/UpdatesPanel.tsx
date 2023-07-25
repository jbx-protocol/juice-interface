import { PlusIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import useMobile from 'hooks/useMobile'
import { useEffect } from 'react'
import { AddProjectUpdateModal } from '../AddProjectUpdateModal'
import { EmptyScreen } from '../EmptyScreen'
import { PopupMenu } from '../PopupMenu/PopupMenu'
import {
  ProjectUpdate,
  ProjectUpdateSkeleton,
} from './components/ProjectUpdate'
import { useUpdatesPanel } from './hooks/useUpdatesPanel'

export const UpdatesPanel = () => {
  const isMobile = useMobile()
  const {
    loading,
    addProjectUpdateButtonLoading,
    projectUpdates,
    error,
    open,
    isProjectOwner,
    setOpen,
    handleAddProjectUpdateClicked,
    loadProjectUpdates,
  } = useUpdatesPanel()

  useEffect(() => {
    loadProjectUpdates()
  }, [loadProjectUpdates])

  const containerClassName =
    'flex w-full flex-col items-center gap-6 md:max-w-[596px]'

  const emptyScreenMessage = isProjectOwner
    ? t`Your project has no updates`
    : t`This project has no updates`

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
      <>
        <div className="flex flex-col gap-5">
          <div className={containerClassName}>
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
          </div>
          {error && (
            <div className="text-center text-error-500">ERROR: {error}</div>
          )}
        </div>
        <AddProjectUpdateModal open={open} setOpen={setOpen} />
      </>
    )
  }

  return (
    <>
      <div className="flex w-full flex-col items-center gap-6 md:max-w-[596px]">
        <div className="flex w-full justify-between gap-5">
          <span className="text-start font-heading text-2xl font-medium">
            <Trans>Project Updates</Trans>
          </span>
          {isProjectOwner &&
            (isMobile ? (
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
                    onClick: handleAddProjectUpdateClicked,
                  },
                ]}
              />
            ) : (
              <Button
                className="flex items-center gap-2 text-base font-medium"
                type="link"
                icon={<PlusIcon className="h-5 w-5" />}
                onClick={handleAddProjectUpdateClicked}
              >
                <Trans>Add project update</Trans>
              </Button>
            ))}
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
