import { Trans } from '@lingui/macro'
import { ErrorBoundaryCallout } from 'components/Callout/ErrorBoundaryCallout'
import Loading from 'components/Loading'
import VolumeChart from 'components/VolumeChart'
import { PV_V4 } from 'constants/pv'
import { useProjectQuery } from 'generated/v4/graphql'
import { useJBChainId, useJBContractContext } from 'juice-sdk-react'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { Suspense } from 'react'
import { V4ActivityList } from './V4ActivityList'

export function V4ActivityPanel() {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()

  const { data } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      projectId: Number(projectId),
      chainId: chainId || 0,
      version: parseInt(PV_V4) // TODO dynamic pv (4/5)
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
      <V4ActivityList />
    </div>
  )
}
