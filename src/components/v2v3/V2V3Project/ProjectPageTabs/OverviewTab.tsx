import { Trans } from '@lingui/macro'
import { ErrorBoundaryCallout } from 'components/ErrorBoundaryCallout'
import VolumeChart from 'components/VolumeChart'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import TreasuryStats from '../TreasuryStats'
import { AllAssetsButton } from './AllAssetsButton'

export default function OverviewTab() {
  const { createdAt } = useContext(V2V3ProjectContext)
  const { projectId, pv } = useContext(ProjectMetadataContext)

  return (
    <>
      <section>
        <TreasuryStats />
        <div className="text-right">
          <AllAssetsButton />
        </div>
      </section>
      {pv ? (
        <section className="mt-10">
          <ErrorBoundaryCallout
            message={<Trans>Volume chart failed to load.</Trans>}
          >
            <VolumeChart
              style={{ height: 240 }}
              createdAt={createdAt}
              projectId={projectId}
              pv={pv}
            />
          </ErrorBoundaryCallout>
        </section>
      ) : null}
    </>
  )
}
