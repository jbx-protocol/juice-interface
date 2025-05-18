import { Trans } from '@lingui/macro'
import { ErrorBoundaryCallout } from 'components/Callout/ErrorBoundaryCallout'
import Loading from 'components/Loading'
import VolumeChart from 'components/VolumeChart'
import { PV_V4 } from 'constants/pv'
import { useJBContractContext } from 'juice-sdk-react'
import { ProjectsDocument } from 'packages/v4/graphql/client/graphql'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import { Suspense } from 'react'
import { V4ActivityList } from './V4ActivityList'

export function V4ActivityPanel() {
  const { projectId } = useJBContractContext()
  const { data } = useSubgraphQuery({
    document: ProjectsDocument, 
    variables: {
      where: {
        projectId: Number(projectId),
      },
    }
  })
  
  const createdAt = data?.projects?.[0]?.createdAt

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
