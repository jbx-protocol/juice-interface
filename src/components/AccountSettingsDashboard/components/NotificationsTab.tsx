import { Trans, t } from '@lingui/macro'
import { Badge } from 'components/Badge'
import Loading from 'components/Loading'
import { useNotificationsTab } from '../hooks/useNotificationsTab'
import { ProjectUnwatchCell } from './ProjectUnwatchCell'
import { UnwatchButton } from './UnwatchButton'

export const NotificationsTab = () => {
  const {
    subscriptions: { loading, notifications, error },
    onUnwatchAllClicked,
    onUnwatchClicked: _onUnwatchClicked,
  } = useNotificationsTab()

  const onUnwatchedClicked = (projectId: number) => () =>
    _onUnwatchClicked({ projectId })

  const projectsFollowedByUser = notifications
    .map(n => n.project_id)
    .filter(Boolean) as number[]

  return (
    <div className="flex flex-col gap-y-10">
      <div>
        <h1 className="text-primary text-2xl">
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
        <div className="stroke-secondary rounded-lg border border-solid">
          <div className="stroke-secondary flex justify-between rounded-t-lg border border-x-0 border-t-0 border-b border-solid bg-smoke-100 py-3 px-4 dark:bg-slate-600">
            <span className="flex items-center gap-2 font-bold">
              <Trans>Watching projects</Trans>{' '}
              <Badge variant="info">{projectsFollowedByUser.length}</Badge>
            </span>
            <UnwatchButton
              className="border-error-500 text-error-500 dark:border-error-500 dark:text-error-300"
              text={t`Unwatch all`}
              onClick={onUnwatchAllClicked}
            />
          </div>
          {projectsFollowedByUser.map((projectId, i) => (
            <ProjectUnwatchCell
              key={projectId}
              className={
                i !== 0
                  ? 'stroke-tertiary border-x-0 border-t border-b-0 border-solid'
                  : ''
              }
              projectId={projectId}
              onUnwatch={onUnwatchedClicked(projectId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
