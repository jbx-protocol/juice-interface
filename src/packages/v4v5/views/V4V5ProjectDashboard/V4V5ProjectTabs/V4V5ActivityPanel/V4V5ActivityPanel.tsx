import { Trans } from '@lingui/macro'
import { ErrorBoundaryCallout } from 'components/Callout/ErrorBoundaryCallout'
import Loading from 'components/Loading'
import VolumeChart from 'components/VolumeChart'
import { PV_V4 } from 'constants/pv'
import { useProjectQuery } from 'generated/v4v5/graphql'
import { useJBChainId, useJBContractContext } from 'juice-sdk-react'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { Suspense } from 'react'
import { V4V5ActivityList } from './V4V5ActivityList'

export function V4V5ActivityPanel() {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()

  const { data } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      projectId: Number(projectId),
      chainId: chainId || 0,
      version: version
    },
  })

  const createdAt = data?.project?.createdAt

  return (
    <div className="min-h-[384px] w-full">
      {Boolean(projectId) && (
        <div className="mb-10">
          <Suspense fallback={<Loading />}>
            <ErrorBoundaryCallout
              message={<Trans>Volume chart failed to load.</Trans>}
            >
              <VolumeChart
                height={240}
                projectId={Number(projectId)}
                createdAt={createdAt}
                pv={PV_V4}
              />
            </ErrorBoundaryCallout>
          </Suspense>
        </div>
      )}
      <V4V5ActivityList />
    </div>
  )
}
