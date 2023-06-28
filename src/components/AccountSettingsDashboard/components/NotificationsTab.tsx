import { Trans, t } from '@lingui/macro'
import { Badge } from 'components/Badge'
import Loading from 'components/Loading'
import { DeleteConfirmationModal } from 'components/modals/DeleteConfirmationModal'
import { twMerge } from 'tailwind-merge'
import { useNotificationsTab } from '../hooks/useNotificationsTab'
import { ProjectUnwatchCell } from './ProjectUnwatchCell'
import { UnwatchButton } from './UnwatchButton'

export const NotificationsTab = () => {
  const {
    confirmationModal,
    subscriptions: { loading, notifications, error },
    onModalConfirmationClicked,
    onUnwatchClicked: _onUnwatchClicked,
  } = useNotificationsTab()

  const onUnwatchedClicked = (projectId: number) => () =>
    _onUnwatchClicked({ projectId })

  const projectsFollowedByUser = notifications
    .map(n => n.project_id)
    .filter(Boolean) as number[]

  const unwatchAllButtonDisabled = projectsFollowedByUser.length === 0

  return (
    <>
      <div className="flex flex-col gap-y-10">
        <div>
          <h1 className="text-primary flex items-center gap-2 text-2xl">
            <Trans>Notifications</Trans> <Badge variant="info">Beta</Badge>
          </h1>
          <div className="text-secondary">
            <Trans>Manage your notifications and email preferences.</Trans>
          </div>
        </div>
        {error && <div className="text-error">{error}</div>}

        {loading ? (
          <Loading />
        ) : (
          <div className="stroke-secondary rounded-lg border">
            <div className="stroke-secondary flex justify-between rounded-t-lg border border-b bg-smoke-100 py-3 px-4 dark:bg-slate-600">
              <span className="flex items-center gap-2 font-medium">
                <Trans>Watching projects</Trans>{' '}
                <Badge variant="info">{projectsFollowedByUser.length}</Badge>
              </span>
              <UnwatchButton
                className={twMerge(
                  !unwatchAllButtonDisabled
                    ? 'border-error-500 text-error-500 dark:border-error-500 dark:text-error-300'
                    : '',
                )}
                text={t`Unwatch all`}
                disabled={unwatchAllButtonDisabled}
                onClick={confirmationModal.open}
              />
            </div>
            {projectsFollowedByUser.map((projectId, i) => (
              <ProjectUnwatchCell
                key={projectId}
                className={i !== 0 ? 'stroke-tertiary border-t' : ''}
                projectId={projectId}
                onUnwatch={onUnwatchedClicked(projectId)}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        body={t` Are you sure you want to unwatch all projects? You will no longer be notified about new events.`}
        open={confirmationModal.visible}
        onOk={onModalConfirmationClicked}
        onCancel={confirmationModal.close}
      ></DeleteConfirmationModal>
    </>
  )
}
