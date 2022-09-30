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
              Your Juicebox project has no active funding cycle. Launch a
              funding cycle to re-enable payments on your project.
            </Trans>
          </p>
        }
        actions={
          <>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              <Trans>Review and launch funding cycle</Trans>
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
