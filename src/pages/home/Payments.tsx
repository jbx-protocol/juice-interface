import ETHAmount from 'components/currency/ETHAmount'
import FormattedAddress from 'components/FormattedAddress'
import Loading from 'components/Loading'
import ProjectVersionBadge from 'components/ProjectVersionBadge'
import RichNote from 'components/RichNote'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import V2V3ProjectHandle from 'components/v2v3/shared/V2V3ProjectHandle'
import { CV_V1, CV_V1_1 } from 'constants/cv'
import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { Project } from 'models/subgraph-entities/vX/project'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'

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
      { entity: 'project', keys: ['id', 'projectId', 'handle', 'cv'] },
    ],
    first: 20,
    orderDirection: 'desc',
    orderBy: 'timestamp',
  })

  const ProjectHandle = ({ project }: { project: Partial<Project> }) => {
    if (!project?.projectId) return null

    return (
      <div style={{ color: colors.text.action.primary, fontWeight: 500 }}>
        {project.cv === CV_V1 || project.cv === CV_V1_1 ? (
          <V1ProjectHandle
            projectId={project.projectId}
            handle={project.handle}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <V2V3ProjectHandle
              projectId={project.projectId}
              handle={project.handle}
              style={{ marginRight: '0.5rem' }}
            />
            <ProjectVersionBadge versionText={`V${project.cv}`} size="small" />
          </div>
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
                  <ETHAmount amount={e.amount} precision={2} />
                </span>
                <span>
                  <FormattedAddress address={e.beneficiary} />
                </span>
              </div>
              <div>
                <RichNote
                  note={e.note}
                  style={{ color: colors.text.secondary }}
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
