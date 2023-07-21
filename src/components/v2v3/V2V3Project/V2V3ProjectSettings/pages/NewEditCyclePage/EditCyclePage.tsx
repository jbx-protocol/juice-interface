import { Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Loading from 'components/Loading'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import Link from 'next/link'
import { useContext } from 'react'
import { helpPagePath, settingsPagePath } from 'utils/routes'
import { DetailsSection } from './DetailsSection/DetailsSection'
import { useEditCycleForm } from './EditCycleFormContext'
import { EditCycleFormSection } from './EditCycleFormSection'
import { PayoutsSection } from './PayoutsSection/PayoutsSection'

export function EditCyclePage() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  const { editCycleForm, initialFormData } = useEditCycleForm()
  if (!initialFormData) return <Loading className="h-24" />
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
        <Form
          form={editCycleForm}
          layout="vertical"
          initialValues={initialFormData}
        >
          <EditCycleFormSection
            title={<Trans>Details</Trans>}
            description={
              <Trans>
                Set up your top-level project configuration details.
              </Trans>
            }
          >
            <DetailsSection />
          </EditCycleFormSection>

          <EditCycleFormSection
            title={<Trans>Payouts</Trans>}
            description={
              <Trans>How your project will be paid and pay out in ETH.</Trans>
            }
          >
            <PayoutsSection />
          </EditCycleFormSection>

          <EditCycleFormSection
            title={<Trans>Tokens</Trans>}
            description={
              <Trans>Manage how your projects tokens should work.</Trans>
            }
          >
            <div>Todo</div>
          </EditCycleFormSection>

          <EditCycleFormSection
            title={<Trans>NFTs</Trans>}
            description={
              <Trans>
                Manage how you reward supporters when they support your project.
              </Trans>
            }
            className="border-b-0"
          >
            <div>Todo</div>
          </EditCycleFormSection>
        </Form>
      </div>

      <div className="flex items-center justify-end gap-4">
        {projectId && handle ? (
          <Link href={settingsPagePath(undefined, { projectId, handle })}>
            <Button>
              <Trans>Cancel</Trans>
            </Button>
          </Link>
        ) : null}

        <Button
          type="primary"
          onClick={
            () => null
            // TODO: make it open modal which will then call hooks/SaveEditCycleForm.tsx
          }
        >
          <Trans>Save changes</Trans>
        </Button>
      </div>
    </div>
  )
}
