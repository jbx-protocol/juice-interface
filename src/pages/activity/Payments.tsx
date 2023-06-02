import ETHAmount from 'components/currency/ETHAmount'
import { JuiceboxAccountLink } from 'components/JuiceboxAccountLink'
import Loading from 'components/Loading'
import RichNote from 'components/RichNote'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { PV_V1 } from 'constants/pv'
import { usePayEventsQuery } from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { Project } from 'models/subgraph-entities/vX/project'
import { classNames } from 'utils/classNames'
import { formatHistoricalDate } from 'utils/format/formatDate'

const ProjectHandle = ({ project }: { project: Partial<Project> }) => {
  if (!project?.projectId) return null

  return (
    <div className="font-medium text-bluebs-500 dark:text-bluebs-300">
      {project.pv === PV_V1 ? (
        <V1ProjectHandle
          projectId={project.projectId}
          handle={project.handle}
        />
      ) : (
        <div className="flex items-baseline">
          <V2V3ProjectHandleLink
            className="mr-2"
            projectId={project.projectId}
            handle={project.handle}
          />
        </div>
      )}
    </div>
  )
}

export function PaymentsFeed() {
  const { data, loading } = usePayEventsQuery({
    client,
    variables: {
      first: 20,
    },
  })

  const events = data?.payEvents

  return (
    <div>
      {events || !loading ? (
        <div>
          {events?.map((e, i) => (
            <div
              className={classNames(
                'mb-2 border-b border-smoke-200 pb-5 dark:border-grey-600',
                i !== 0 ? 'pt-2' : '',
              )}
              key={e.id}
            >
              <div className="flex items-baseline justify-between">
                <ProjectHandle project={e.project} />

                <div className="text-xs text-grey-500 dark:text-grey-300">
                  {e.timestamp && formatHistoricalDate(e.timestamp * 1000)}
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-medium">
                  <ETHAmount amount={e.amount} precision={2} />
                </span>
                <span>
                  <JuiceboxAccountLink address={e.beneficiary} withEnsAvatar />
                </span>
              </div>
              <div>
                <RichNote
                  className="text-grey-900 dark:text-slate-100"
                  note={e.note}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}
