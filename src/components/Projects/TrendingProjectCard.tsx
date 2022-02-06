import CurrencySymbol from 'components/shared/CurrencySymbol'
import Loading from 'components/shared/Loading'
import ProjectLogo from 'components/shared/ProjectLogo'

import { t, Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import { constants } from 'ethers'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { TrendingProject } from 'models/subgraph-entities/project'
import { CSSProperties, useContext, useMemo } from 'react'
import { formatWad } from 'utils/formatNumber'
import { getTerminalVersion } from 'utils/v1/terminals'
import pluralize from 'utils/pluralize'

import { Link } from 'react-router-dom'

import { SECONDS_IN_DAY } from 'constants/numbers'
import { CURRENCY_ETH } from 'constants/currency'

export default function TrendingProjectCard({
  project,
  size,
  rank,
  trendingWindowDays,
}: {
  project: TrendingProject
  size?: 'sm' | 'lg'
  rank: number
  trendingWindowDays: number
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const cardStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'pre',
    height: '100%',
    overflow: 'hidden',
    padding: '25px 20px',
  }

  const rankStyle: CSSProperties = {
    fontSize: 22,
    color: colors.text.primary,
    fontWeight: 400,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  }

  const { data: metadata } = useProjectMetadata(project?.uri)

  const terminalVersion = getTerminalVersion(project?.terminal)

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    project.trendingVolume?.gt(0) &&
    project.trendingVolume.lt(constants.WeiPerEther)
      ? 2
      : 0

  const percentGainText = useMemo(() => {
    if (
      project.createdAt &&
      project.createdAt >
        new Date().valueOf() / 1000 - trendingWindowDays * SECONDS_IN_DAY
    ) {
      return t`New`
    }

    const preTrendingVolume = project.totalPaid?.sub(project.trendingVolume)

    if (!preTrendingVolume?.gt(0)) return '+∞'

    const percentGain = project.trendingVolume
      .mul(10000)
      .div(preTrendingVolume)
      .toNumber()

    let percentRounded: number

    // If percentGain > 1, round to int
    if (percentGain >= 100) {
      percentRounded = Math.round(percentGain / 100)
      // If 0.1 <= percentGain < 1, round to 1dp
    } else if (percentGain >= 10) {
      percentRounded = Math.round(percentGain / 10) / 10
      // If percentGain < 0.1, round to 2dp
    } else {
      percentRounded = percentGain / 100
    }

    return `+${percentRounded}%`
  }, [project, trendingWindowDays])

  const paymentCount = project.trendingPaymentsCount

  return project ? (
    <Link
      style={{
        borderRadius: radii.lg,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      key={project.handle}
      to={`/p/${project.handle}`}
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

            <div
              style={{
                color: colors.text.primary,
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontWeight: 600, marginTop: 3 }}>
                  <CurrencySymbol currency={CURRENCY_ETH} />
                  {formatWad(project.trendingVolume, { precision })}{' '}
                </span>
                <span style={{ fontWeight: 400, color: colors.text.secondary }}>
                  <Trans>last {trendingWindowDays} days</Trans>{' '}
                </span>
                <span style={{ fontWeight: 600, color: colors.text.header }}>
                  {percentGainText && <>{percentGainText}</>}
                </span>
              </span>
            </div>

            <div
              style={{
                fontWeight: 400,
                color: colors.text.secondary,
                fontSize: 13,
                marginTop: 2,
              }}
            >
              {pluralize(paymentCount, 'payment', 'payments')}
            </div>
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
    </Link>
  ) : (
    <Loading />
  )
}
