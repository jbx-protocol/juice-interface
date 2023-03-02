import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import Banner from 'components/Banner'
import { useState } from 'react'
import { RelaunchFundingCycleModal } from './RelaunchFundingCycleModal'

export function RelaunchFundingCycleBanner() {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <>
      <Banner
        title={<Trans>Funding cycle required.</Trans>}
        body={
          <p>
            <Trans>
              Your Juicebox project has no active cycle. Launch a cycle to
              re-enable payments to your project.
            </Trans>
          </p>
        }
        actions={
          <>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              <Trans>Review and launch cycle</Trans>
            </Button>
          </>
        }
      />
      <RelaunchFundingCycleModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
