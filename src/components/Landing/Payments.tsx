import RichNote from 'components/shared/RichNote'
import FormattedAddress from 'components/shared/FormattedAddress'
import Loading from 'components/shared/Loading'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'

import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'

import ETHAmount from 'components/shared/currency/ETHAmount'
import { Project } from 'models/subgraph-entities/vX/project'
import V2ProjectHandle from 'components/v2/shared/V2ProjectHandle'

export default function Payments() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { data: events, isLoading } = useSubgraphQuery({
    entity: 'payEvent',
    keys: [
      'amount',
      'beneficiary',
      'note',
      'timestamp',
      'id',
      { entity: 'project', keys: ['id', 'projectId', 'cv'] },
    ],
    first: 20,
    orderDirection: 'desc',
    orderBy: 'timestamp',
  })

  const ProjectHandle = ({ project }: { project: Partial<Project> }) => {
    if (!project?.projectId) return null

    return (
      <div style={{ color: colors.text.action.primary, fontWeight: 500 }}>
        {project.cv === '2' ? (
          <V2ProjectHandle projectId={project.projectId} />
        ) : (
          <V1ProjectHandle projectId={project.projectId} />
        )}
      </div>
    )
  }

  return (
    <div>
      {events || !isLoading ? (
        <div>
          {events?.map((e, i) => (
            <div
              key={e.id}
              style={{
                paddingTop: i === 0 ? 0 : 10,
                paddingBottom: 20,
                marginBottom: 10,
                borderBottom: '1px solid ' + colors.stroke.tertiary,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <ProjectHandle project={e.project} />

                <div
                  style={{ fontSize: '.7rem', color: colors.text.secondary }}
                >
                  {e.timestamp && formatHistoricalDate(e.timestamp * 1000)}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                  <ETHAmount amount={e.amount} precision={4} />
                </span>
                <span>
                  <FormattedAddress address={e.beneficiary} />
                </span>
              </div>
              <div>
                <RichNote note={e.note} />
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
