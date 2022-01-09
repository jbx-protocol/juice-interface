import { Tooltip } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { Project } from 'models/subgraph-entities/project'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'

import { CURRENCY_ETH } from 'constants/currency'

import CurrencySymbol from './CurrencySymbol'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'
import { getTerminalVersion } from 'utils/terminal-versions'

export default function ProjectCard({
  project,
}: {
  project: Pick<
    Project,
    'handle' | 'uri' | 'totalPaid' | 'createdAt' | 'terminal'
  >
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

  const terminalVersion = getTerminalVersion(project.terminal)

  return (
    <div
      style={{
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
            padding: 20,
          }}
        >
          <div style={{ marginRight: 20 }}>
            <ProjectLogo
              uri={metadata.logoUri}
              name={metadata.name}
              size={110}
            />
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
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

            <div>
              <span style={{ color: colors.text.primary, fontWeight: 500 }}>
                @{project.handle}
              </span>
              <span
                style={{
                  marginLeft: 10,
                  color: colors.text.tertiary,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                }}
              >
                V{terminalVersion}
              </span>
            </div>

            <div style={{ color: colors.text.secondary }}>
              <span>
                <CurrencySymbol currency={CURRENCY_ETH} />
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
