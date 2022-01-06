import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'

import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { Project } from 'models/subgraph-entities/project'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { InfoCircleOutlined } from '@ant-design/icons'

import CurrencySymbol from './CurrencySymbol'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'
import { archivedProjectIds } from 'constants/archived-projects'

export default function ProjectCard({
  project,
}: {
  project: Pick<Project, 'id' | 'handle' | 'uri' | 'totalPaid' | 'createdAt'>
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const { data: metadata } = useProjectMetadata(project.uri)
  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const decimals =
    project.totalPaid?.gt(0) &&
    project.totalPaid.lt(BigNumber.from('10000000000000000000'))
      ? 2
      : 0
  return (
    <div
      style={{
        padding: 20,
        borderRadius: radii.lg,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      className="clickable-border"
      key={project?.handle}
      onClick={() => (window.location.hash = '/p/' + project.handle)}
    >
      {metadata ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre',
            overflow: 'hidden',
          }}
        >
          <div style={{ marginRight: 20 }}>
            <ProjectLogo
              uri={metadata.logoUri}
              name={metadata.name}
              size={80}
            />
          </div>

          <div style={{ minWidth: 0, flexGrow: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  color: colors.text.primary,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {metadata.name}
              </h2>

              {archivedProjectIds.includes(project.id!.toNumber()) && (
                <Tooltip title="This project has been archived and cannot be paid.">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3>
                      <InfoCircleOutlined /> Archived
                    </h3>
                  </div>
                </Tooltip>
              )}
            </div>

            <div style={{ color: colors.text.tertiary }}>
              <span style={{ color: colors.text.primary, fontWeight: 500 }}>
                <CurrencySymbol currency={0} />
                {formatWad(project.totalPaid, { decimals })}{' '}
              </span>
              since{' '}
              {!!project.createdAt &&
                formatDate(project.createdAt * 1000, 'MM-DD-YY')}
            </div>

            {metadata.description && (
              <Tooltip title={metadata.description} placement="bottom">
                <div
                  style={{
                    maxHeight: 20,
                    color: colors.text.tertiary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {metadata.description}
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {project.handle} <Loading />
        </div>
      )}
    </div>
  )
}
