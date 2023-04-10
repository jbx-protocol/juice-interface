import { Trans } from '@lingui/macro'
import { Row } from 'antd'
import { ErrorBoundaryCallout } from 'components/ErrorBoundaryCallout'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import ScrollToTopButton from 'components/buttons/ScrollToTopButton'
import { useModalFromUrlQuery } from 'components/modals/hooks/ModalFromUrlQuery'
import { V2V3PayProjectFormProvider } from 'components/v2v3/V2V3Project/V2V3PayButton/V2V3ConfirmPayModal/V2V3PayProjectFormProvider'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import useMobile from 'hooks/Mobile'
import { useContext } from 'react'
import { ProjectPageMobile } from './ProjectPageMobile'
import { ProjectPageRightCol } from './ProjectPageRightCol'
import { ProjectPageTabs } from './ProjectPageTabs'
import { V2V3ProjectHeaderActions } from './V2V3ProjectHeaderActions/V2V3ProjectHeaderActions'
import { ProjectBanners } from './banners/ProjectBanners'
import NewDeployModal, { NEW_DEPLOY_QUERY_PARAM } from './modals/NewDeployModal'

export const GUTTER_PX = 24
export const COL_SIZE_MD = 12

export function V2V3Project() {
  const { projectOwnerAddress, handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { visible: newDeployModalVisible, hide: hideNewDeployModal } =
    useModalFromUrlQuery(NEW_DEPLOY_QUERY_PARAM)

  const isMobile = useMobile()
  const isOwner = useIsUserAddress(projectOwnerAddress)

  const canEditProjectHandle = isOwner && !handle

  if (projectId === undefined) return null

  return (
    <div className="flex flex-col gap-6">
      <ProjectBanners />

      <ProjectHeader
        actions={<V2V3ProjectHeaderActions />}
        handle={handle}
        projectOwnerAddress={projectOwnerAddress}
        canEditProjectHandle={canEditProjectHandle}
      />

      <V2V3PayProjectFormProvider>
        {/* <div className="my-0 mx-auto flex max-w-5xl flex-col gap-y-5 px-5 pb-5"> */}
        <div className="my-0 mx-auto flex w-full max-w-5xl flex-col gap-y-5 px-5 pb-5">
          {isMobile ? (
            <ProjectPageMobile />
          ) : (
            <Row gutter={48} className="gap-y-10">
              <ErrorBoundaryCallout
                message={<Trans>Project details failed to load.</Trans>}
              >
                <ProjectPageTabs />
              </ErrorBoundaryCallout>
              <ProjectPageRightCol />
            </Row>
          )}

          <div className="mt-12 text-center">
            <ScrollToTopButton />
          </div>
        </div>
      </V2V3PayProjectFormProvider>

      <NewDeployModal
        open={newDeployModalVisible}
        onClose={hideNewDeployModal}
      />
    </div>
  )
}
