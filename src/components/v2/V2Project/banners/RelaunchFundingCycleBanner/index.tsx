import { Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { useContext, useState } from 'react'

import Banner from 'components/shared/Banner'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useDeprecatedProjectCurrentFundingCycle from 'hooks/v2/contractReader/DeprecatedProjectCurrentFundingCycle'

import ReconfigurePreview from '../../V2ProjectReconfigureModal/ReconfigurePreview'

export default function RelaunchFundingCycleBanner() {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { projectId } = useContext(V2ProjectContext)
  const { data, loading: deprecatedFundingCycleLoading } =
    useDeprecatedProjectCurrentFundingCycle({
      projectId,
    })

  const onLaunchModalOk = () => {}

  const [deprecatedFundingCycle, deprecatedFundingCycleMetadata] = data ?? []

  if (!deprecatedFundingCycle || !deprecatedFundingCycleMetadata) {
    return null
  }

  return (
    <>
      <Banner
        title={<Trans>Funding cycle required.</Trans>}
        body={
          <Trans>
            Your Juicebox project has no current funding cycle. Launch a funding
            cycle to re-enable payments on your project.
          </Trans>
        }
        actions={
          <>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              <Trans>Review and launch funding cycle</Trans>
            </Button>
          </>
        }
      />
      <Modal
        visible={modalOpen}
        title={<Trans>Launch funding cycle</Trans>}
        okText={<Trans>Launch funding cycle</Trans>}
        width={700}
        onOk={onLaunchModalOk}
        onCancel={() => setModalOpen(false)}
      >
        {deprecatedFundingCycleLoading ? (
          'loading...'
        ) : (
          <ReconfigurePreview
            payoutSplits={[]}
            reserveSplits={[]}
            fundingCycleMetadata={deprecatedFundingCycleMetadata}
            fundingCycleData={deprecatedFundingCycle}
            fundAccessConstraints={[]}
          />
        )}
      </Modal>
    </>
  )
}
