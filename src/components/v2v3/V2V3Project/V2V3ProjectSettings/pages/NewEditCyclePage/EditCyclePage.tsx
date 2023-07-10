import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import Link from 'next/link'
import { useContext } from 'react'
import { helpPagePath, settingsPagePath } from 'utils/routes'
import { DetailsSection } from './DetailsSection/DetailsSection'
import { EditCycleHeading } from './EditCycleHeader'

function EditCycleSection({
  title,
  description,
  children,
}: {
  title: JSX.Element
  description: JSX.Element
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-4 py-5 md:grid-cols-[300px_1fr]">
      <EditCycleHeading title={title} description={description} />
      {children}
    </section>
  )
}

export function EditCyclePage() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  return (
    <div>
      <p>
        <Trans>
          Configure your cycle for transparent treasury and campaign management.
          Any adjustments made will be published on Ethereum to inform
          contributors.
        </Trans>{' '}
        <ExternalLink href={helpPagePath('')}>Learn more</ExternalLink>
      </p>

      {/* Details */}
      <div className="divide-y divide-solid divide-slate-400">
        <EditCycleSection
          title={<Trans>Details</Trans>}
          description={
            <Trans>Set up your top-level project configuration details.</Trans>
          }
        >
          <DetailsSection />
        </EditCycleSection>

        <EditCycleSection
          title={<Trans>Payouts</Trans>}
          description={
            <Trans>How your project will be paid and pay out in ETH.</Trans>
          }
        >
          <div>Todo</div>
        </EditCycleSection>

        <EditCycleSection
          title={<Trans>Tokens</Trans>}
          description={
            <Trans>Manage how your projects tokens should work.</Trans>
          }
        >
          <div>Todo</div>
        </EditCycleSection>

        <EditCycleSection
          title={<Trans>NFTs</Trans>}
          description={
            <Trans>
              Manage how you reward supporters when they support your project.
            </Trans>
          }
        >
          <div>Todo</div>
        </EditCycleSection>
      </div>

      <div className="flex items-center justify-end gap-4">
        {projectId && handle ? (
          <Link href={settingsPagePath(undefined, { projectId, handle })}>
            <Button>
              <Trans>Cancel</Trans>
            </Button>
          </Link>
        ) : null}

        <Button type="primary">
          <Trans>Save changes</Trans>
        </Button>
      </div>
    </div>
  )
}
