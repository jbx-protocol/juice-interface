import { Trans } from '@lingui/macro'
import { ErrorBoundaryCallout } from 'components/Callout/ErrorBoundaryCallout'
import Loading from 'components/Loading'
import VolumeChart from 'components/VolumeChart'
import { PV_V4 } from 'constants/pv'
import { useProjectQuery } from 'generated/v4v5/graphql'
import { useJBChainId, useJBContractContext } from 'juice-sdk-react'
import { getBendystrawClient } from 'lib/apollo/bendystrawClient'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { forwardRef, Suspense } from 'react'
import { V4V5TokenHoldersChart } from './V4V5TokenHoldersChart'

export const V4V5AnalyticsPanel = forwardRef<HTMLDivElement>((props, ref) => {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()

  const { data } = useProjectQuery({
    client: getBendystrawClient(chainId),
    variables: {
      projectId: Number(projectId),
      chainId: chainId || 0,
      version: version
    },
  })

  const createdAt = data?.project?.createdAt

  return (
    <div ref={ref} className="min-h-[384px] w-full">
      {Boolean(projectId) && (
        <>
          {/* Volume Chart */}
          <div className="mb-10">
            <h3 className="mb-4 font-heading text-xl font-medium">
              <Trans>Volume</Trans>
            </h3>
            <Suspense fallback={<Loading />}>
              <ErrorBoundaryCallout
                message={<Trans>Volume chart failed to load.</Trans>}
              >
                <VolumeChart
                  height={240}
                  projectId={Number(projectId)}
                  createdAt={createdAt}
                  pv={PV_V4}
                  version={version}
                  lockedView="volume"
                  hideViewSelector={true}
                />
              </ErrorBoundaryCallout>
            </Suspense>
          </div>

          {/* Token Holders Chart */}
          <div className="mb-10">
            <Suspense fallback={<Loading />}>
              <ErrorBoundaryCallout
                message={<Trans>Token holders chart failed to load.</Trans>}
              >
                <V4V5TokenHoldersChart />
              </ErrorBoundaryCallout>
            </Suspense>
          </div>

          {/* In Juicebox Chart */}
          <div className="mb-10">
            <h3 className="mb-4 font-heading text-xl font-medium">
              <Trans>In Juicebox</Trans>
            </h3>
            <Suspense fallback={<Loading />}>
              <ErrorBoundaryCallout
                message={<Trans>Balance chart failed to load.</Trans>}
              >
                <VolumeChart
                  height={240}
                  projectId={Number(projectId)}
                  createdAt={createdAt}
                  pv={PV_V4}
                  version={version}
                  lockedView="balance"
                  hideViewSelector={true}
                />
              </ErrorBoundaryCallout>
            </Suspense>
          </div>

          {/* Trending Chart */}
          <div className="mb-10">
            <h3 className="mb-4 font-heading text-xl font-medium">
              <Trans>Trending</Trans>
            </h3>
            <Suspense fallback={<Loading />}>
              <ErrorBoundaryCallout
                message={<Trans>Trending chart failed to load.</Trans>}
              >
                <VolumeChart
                  height={240}
                  projectId={Number(projectId)}
                  createdAt={createdAt}
                  pv={PV_V4}
                  version={version}
                  lockedView="trendingScore"
                  hideViewSelector={true}
                />
              </ErrorBoundaryCallout>
            </Suspense>
          </div>
        </>
      )}
    </div>
  )
})

V4V5AnalyticsPanel.displayName = 'V4V5AnalyticsPanel'
