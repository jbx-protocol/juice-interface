import { Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import { ExternalLinkWithIcon } from 'components/ExternalLinkWithIcon'
import Loading from 'components/Loading'
import EditCycleFormSection from 'components/Project/ProjectSettings/EditCycleFormSection'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { settingsPagePath } from 'packages/v4/utils/routes'
import { useContext, useEffect, useRef, useState } from 'react'
import { helpPagePath } from 'utils/helpPagePath'
import { useChainId } from 'wagmi'
import { DetailsSection } from './DetailsSection'
import { useEditCycleFormContext } from './EditCycleFormContext'
import { PayoutsSection } from './PayoutsSection'
// import { DetailsSection } from './DetailsSection'

export function EditCyclePage() {
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [firstRender, setFirstRender] = useState(true)

  const { projectId } = useContext(ProjectMetadataContext)

  const { editCycleForm, initialFormData, formHasUpdated, setFormHasUpdated } =
    useEditCycleFormContext()

  // const { error } = useEditCycleFormHasError() TODO

  const router = useRouter()
  const { section } = router.query

  const chainId = useChainId()

  const detailsRef = useRef<HTMLDivElement>(null)
  const payoutsRef = useRef<HTMLDivElement>(null)
  const tokensRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialFormData && firstRender) {
      switch (section) {
        case 'details':
          detailsRef.current?.scrollIntoView({ behavior: 'smooth' })
          break
        case 'payouts':
          payoutsRef.current?.scrollIntoView({ behavior: 'smooth' })
          break
        case 'tokens':
          tokensRef.current?.scrollIntoView({ behavior: 'smooth' })
          break
        default:
          break
      }
      setFirstRender(false)
    }
  }, [section, firstRender, initialFormData])

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
            ref={detailsRef}
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
            ref={payoutsRef}
            title={<Trans>Payouts</Trans>}
            description={
              <Trans>How your project will be paid and pay out in ETH.</Trans>
            }
          >
            <PayoutsSection />
          </EditCycleFormSection>

          {/* <EditCycleFormSection
            ref={tokensRef}
            title={<Trans>Tokens</Trans>}
            description={
              <Trans>Manage how your project's tokens should work.</Trans>
            }
            className="border-b-0"
          >
            <TokensSection />
          </EditCycleFormSection>
          <ReviewConfirmModal
            open={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
          /> */}
        </Form>
      </div>

      <div className="flex items-center justify-end gap-4">
        {projectId ? (
          <Link href={settingsPagePath({ projectId, chainId })}>
            <Button>
              <Trans>Cancel</Trans>
            </Button>
          </Link>
        ) : null}
        {/* <Tooltip title={error}> */}
          <Button
            type="primary"
            onClick={() => setConfirmModalOpen(true)}
            disabled={false}//Boolean(error)}
          >
            <Trans>Save changes</Trans>
          </Button>
        {/* </Tooltip> */}
      </div>
    </div>
  )
}
