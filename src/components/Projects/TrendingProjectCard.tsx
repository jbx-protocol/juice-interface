import { Tooltip } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import Loading from 'components/shared/Loading'
import ProjectLogo from 'components/shared/ProjectLogo'

import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'
import { getTerminalVersion } from 'utils/terminal-versions'

import { Project } from 'models/subgraph-entities/project'

import { CURRENCY_ETH } from 'constants/currency'
import { trendingWindowDays } from 'constants/trending-projects'

export default function TrendingProjectCard({
  project,
}: {
  project: Project & { trendingVolume: BigNumber | undefined }
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const { data: metadata } = useProjectMetadata(project?.uri)

  const terminalVersion = getTerminalVersion(project?.terminal)

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    project.trendingVolume?.gt(0) &&
    project.trendingVolume.lt(BigNumber.from('10000000000000000000'))
      ? 2
      : 0

  return project ? (
    <a
      style={{
        borderRadius: radii.lg,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      key={project?.handle}
      href={`/#/p/${project?.handle}`}
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
          className="clickable-border"
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
              fontWeight: 400,
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
                @{project?.handle}
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
              <CurrencySymbol currency={CURRENCY_ETH} />
              {formatWad(project.trendingVolume, { precision })} last{' '}
              {trendingWindowDays} days
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
          {project?.handle} <Loading />
        </div>
      )}
    </a>
  ) : (
    <Loading />
  )
}
