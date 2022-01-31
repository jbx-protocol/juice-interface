import { Tooltip } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import Loading from 'components/shared/Loading'
import ProjectLogo from 'components/shared/ProjectLogo'

import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { CSSProperties, useContext } from 'react'
import { formatWad } from 'utils/formatNumber'
import { getTerminalVersion } from 'utils/terminal-versions'

import { Project } from 'models/subgraph-entities/project'

import { CURRENCY_ETH } from 'constants/currency'
import { trendingWindowDays } from 'constants/trending-projects'

export default function TrendingProjectCard({
  project,
  size,
  bg,
  rank,
}: {
  project: Project & { trendingVolume: BigNumber | undefined }
  size?: 'sm' | 'lg'
  bg?: string // Used on homepage
  rank: number
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const cardStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'pre',
    overflow: 'hidden',
    padding: '25px 20px',
    backgroundColor: bg,
    // Shows darker border when background is set
    border: `1px solid ${
      bg ? 'var(--stroke-secondary)' : 'var(--stroke-tertiary)'
    }`,
  }

  const rankStyle: CSSProperties = {
    fontSize: 22,
    color: 'var(--text-primary)',
    fontWeight: 400,
    marginRight: 15,
  }

  const { data: metadata } = useProjectMetadata(project?.uri)

  const terminalVersion = getTerminalVersion(project?.terminal)

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    project.trendingVolume?.gt(0) &&
    project.trendingVolume.lt(BigNumber.from('10000000000000000000'))
      ? 2
      : 0

  const totalVolume = project.totalPaid
  const trendingVolume = project.trendingVolume // volume in the last 7 days

  let percentGain = 0
  if (totalVolume && trendingVolume) {
    const volumeBeforeTrendingWindow = totalVolume.sub(trendingVolume)
    percentGain = trendingVolume
      .mul(100)
      .div(volumeBeforeTrendingWindow)
      .toNumber()
  }

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
        <div style={cardStyle} className="clickable-border">
          <div
            style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}
          >
            <div style={rankStyle}>{rank}</div>
            <ProjectLogo
              uri={metadata.logoUri}
              name={metadata.name}
              size={size === 'sm' ? 70 : 110}
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
                fontSize: size === 'sm' ? 16 : 21,
              }}
            >
              {metadata.name}
            </h2>

            {size === 'sm' ? null : (
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
            )}

            <div style={{ color: colors.text.primary }}>
              <CurrencySymbol currency={CURRENCY_ETH} />
              <span style={{ fontWeight: 600 }}>
                {formatWad(project.trendingVolume, { precision })}
              </span>{' '}
              last {trendingWindowDays} days{' '}
              {percentGain > 0 ? (
                <span style={{ color: colors.text.header, fontWeight: 600 }}>
                  +{percentGain}%
                </span>
              ) : null}
            </div>

            {metadata.description && (
              <Tooltip title={metadata.description} placement="bottom">
                <div
                  style={{
                    maxHeight: 20,
                    color: colors.text.tertiary,
                    fontWeight: 500,
                    fontSize: size === 'sm' ? 13 : 14,
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
