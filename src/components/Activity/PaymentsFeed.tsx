import { Trans } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement/ActivityElement'
import ETHAmount from 'components/currency/ETHAmount'
import Loading from 'components/Loading'
import RichNote from 'components/RichNote/RichNote'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { PV_V1 } from 'constants/pv'
import {
  OrderDirection,
  PayEvent_OrderBy,
  usePayEventsQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { DBProject } from 'models/dbProject'
import { classNames } from 'utils/classNames'

const ProjectHandle = ({
  project,
}: {
  project: Pick<DBProject, 'id' | 'projectId' | 'handle' | 'pv'>
}) => {
  if (!project?.projectId) return null

  return (
    <span className="text-sm font-medium">
      {project.pv === PV_V1 ? (
        <V1ProjectHandle
          projectId={project.projectId}
          handle={project.handle}
        />
      ) : (
        <V2V3ProjectHandleLink
          projectId={project.projectId}
          handle={project.handle}
        />
      )}
    </span>
  )
}

export function PaymentsFeed() {
  const { data, loading } = usePayEventsQuery({
    client,
    variables: {
      first: 20,
      orderBy: PayEvent_OrderBy.timestamp,
      orderDirection: OrderDirection.desc,
    },
  })

  const events = data?.payEvents

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      {events?.map((event, idx) => (
        <div
          className={classNames(
            'mb-2 border-b border-smoke-200 pb-5 dark:border-grey-600',
            idx !== 0 ? 'pt-2' : '',
          )}
          key={event.id}
        >
          <ActivityEvent
            event={event}
            withProjectLink={false}
            header={<ProjectHandle project={event.project} />}
            subject={
              <span className="font-heading text-lg">
                <ETHAmount amount={event.amount} />
              </span>
            }
            extra={
              event.feeFromV2Project ? (
                <Trans>
                  Fee from{' '}
                  <span>
                    <V2V3ProjectHandleLink projectId={event.feeFromV2Project} />
                  </span>
                </Trans>
              ) : (
                <RichNote
                  className="text-grey-900 dark:text-slate-100"
                  note={event.note ?? ''}
                />
              )
            }
          />
        </div>
      ))}
    </div>
  )
}
