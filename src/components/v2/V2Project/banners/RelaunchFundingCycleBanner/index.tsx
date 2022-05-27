import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useContext, useState } from 'react'

import Banner from 'components/shared/Banner'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useDeprecatedProjectCurrentFundingCycle from 'hooks/v2/contractReader/DeprecatedProjectCurrentFundingCycle'
import { useLaunchFundingCyclesTx } from 'hooks/v2/transactor/LaunchFundingCyclesTx'
import TransactionModal from 'components/shared/TransactionModal'
import {
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import ReconfigurePreview from '../../V2ProjectReconfigureModal/ReconfigurePreview'

export default function RelaunchFundingCycleBanner() {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)
  const { projectId } = useContext(V2ProjectContext)
  const { data, loading: deprecatedFundingCycleLoading } =
    useDeprecatedProjectCurrentFundingCycle({
      projectId,
    })

  const launchFundingCycleTx = useLaunchFundingCyclesTx()

  const [deprecatedFundingCycle, deprecatedFundingCycleMetadata] = data ?? []

  if (
    !projectId ||
    !deprecatedFundingCycle ||
    !deprecatedFundingCycleMetadata
  ) {
    return null
  }

  const onLaunchModalOk = async () => {
    const fundingCycleData: V2FundingCycleData = {
      duration: deprecatedFundingCycle.duration,
      ballot: deprecatedFundingCycle.ballot,
      weight: deprecatedFundingCycle.weight,
      discountRate: deprecatedFundingCycle.discountRate,
    }

    const fundingCycleMetadata: V2FundingCycleMetadata =
      deprecatedFundingCycleMetadata

    await launchFundingCycleTx(
      {
        projectId,
        fundingCycleData,
        fundingCycleMetadata,
        fundAccessConstraints: [],
        groupedSplits: [],
      },
      {
        onDone() {
          console.info('Transaction executed. Awaiting confirmation...')
          setTransactionPending(true)
        },
        onConfirmed() {
          setTransactionPending(false)
          window.location.reload()
        },
      },
    )
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
      <TransactionModal
        visible={modalOpen}
        title={<Trans>Launch funding cycle</Trans>}
        okText={
          <span>
            <Trans>Launch funding cycle</Trans>
          </span>
        }
        width={700}
        onOk={onLaunchModalOk}
        onCancel={() => setModalOpen(false)}
        transactionPending={transactionPending}
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
      </TransactionModal>
    </>
  )
}
