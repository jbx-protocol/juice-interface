import { Trans } from '@lingui/macro'
import { Button, Form, Tooltip } from 'antd'
import Loading from 'components/Loading'
import { ExternalLinkWithIcon } from 'components/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { helpPagePath, settingsPagePath } from 'utils/routes'
import { DetailsSection } from './DetailsSection'
import { useEditCycleFormContext } from './EditCycleFormContext'
import { EditCycleFormSection } from './EditCycleFormSection'
import { PayoutsSection } from './PayoutsSection'
import { ReviewConfirmModal } from './ReviewConfirmModal'
import { TokensSection } from './TokensSection'
import { useEditCycleFormHasError } from './hooks/useEditCycleFormHasError'

export function EditCyclePage() {
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)

  const { projectId } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  const { editCycleForm, initialFormData, formHasUpdated, setFormHasUpdated } =
    useEditCycleFormContext()

  const { error } = useEditCycleFormHasError()

  const handleFormValuesChange = () => {
    if (!formHasUpdated) {
      setFormHasUpdated(true)
    }
  }
  if (!initialFormData) return <Loading className="h-70" />

  return (
    <div>
      <p>
        <Trans>
          Configure your cycle for transparent treasury and campaign management.
          Any adjustments made will be published on Ethereum to inform
          contributors.
        </Trans>{' '}
        <ExternalLinkWithIcon
          href={helpPagePath('/user/project/#project-settings')}
        >
          <Trans>Learn more</Trans>
        </ExternalLinkWithIcon>
      </p>

      <div className="divide-y divide-solid divide-slate-400">
        <Form
          form={editCycleForm}
          layout="vertical"
          initialValues={initialFormData}
          onValuesChange={handleFormValuesChange}
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
            className="border-b-0"
          >
            <TokensSection />
          </EditCycleFormSection>
          <ReviewConfirmModal
            open={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
          />
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
        <Tooltip title={error}>
          <Button
            type="primary"
            onClick={() => setConfirmModalOpen(true)}
            disabled={!formHasUpdated || Boolean(error)}
          >
            <Trans>Save changes</Trans>
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
