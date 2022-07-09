import Loading from 'components/Loading'
import ProjectLogo from 'components/ProjectLogo'
import ETHAmount from 'components/currency/ETHAmount'

import { t, Trans, Plural } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import * as constants from '@ethersproject/constants'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { TrendingProject } from 'models/subgraph-entities/vX/project'
import { CSSProperties, useContext, useMemo } from 'react'
import { getTerminalVersion } from 'utils/v1/terminals'

import { Link } from 'react-router-dom'

import { Skeleton } from 'antd'

import { v2ProjectRoute } from 'utils/routes'

import { SECONDS_IN_DAY } from 'constants/numbers'

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

  const { data: metadata } = useProjectMetadata(project?.metadataUri)

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

  return (
    <Link
      style={{
        borderRadius: radii.lg,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      key={project.handle}
      to={
        project.cv === '2' ? v2ProjectRoute(project) : `/p/${project?.handle}`
      }
    >
      <div style={cardStyle} className="clickable-border">
        <div style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}>
          <div style={rankStyle}>{rank}</div>
          <ProjectLogo
            uri={metadata?.logoUri}
            name={metadata?.name}
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
          {metadata ? (
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
          ) : (
            <Skeleton paragraph={false} title={{ width: 120 }} active />
          )}

          {size === 'sm' ? null : (
            <div>
              {project.handle && (
                <span
                  style={{
                    color: colors.text.primary,
                    fontWeight: 500,
                    marginRight: 10,
                  }}
                >
                  @{project.handle}
                </span>
              )}
              <span
                style={{
                  color: colors.text.tertiary,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                }}
              >
                V{terminalVersion ?? project.cv}
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
                <ETHAmount
                  amount={project.trendingVolume}
                  precision={precision}
                />{' '}
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
            <Plural value={paymentCount} one="# payment" other="# payments" />
          </div>
        </div>

        {!metadata && <Loading />}
      </div>
    </Link>
  )
}
