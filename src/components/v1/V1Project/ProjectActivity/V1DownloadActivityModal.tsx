import { t, Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { useEffect, useState, useContext } from 'react'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { readProvider } from 'constants/readProvider'
import {
  downloadParticipants,
  downloadV1Payouts,
  downloadPayments,
  downloadRedemptions,
  downloadAdditionsToBalance,
} from 'utils/buildActivityCsvs'

export function V1DownloadActivityModal({
  open,
  onCancel,
}: {
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const [latestBlockNumber, setLatestBlockNumber] = useState<number>()
  const [blockNumber, setBlockNumber] = useState<number>()

  useEffect(() => {
    readProvider.getBlockNumber().then(val => {
      setLatestBlockNumber(val)
      setBlockNumber(val)
    })
  }, [])

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      cancelText={t`Close`}
      okButtonProps={{ hidden: true }}
      centered
    >
      <div>
        <h4>
          <Trans>Download CSV of project activity</Trans>
        </h4>

        <label className="mt-5 mb-1 block">
          <Trans>Block number</Trans>
        </label>
        <FormattedNumberInput
          value={blockNumber?.toString()}
          onChange={val => setBlockNumber(val ? parseInt(val) : undefined)}
          accessory={
            <InputAccessoryButton
              content={t`Latest`}
              onClick={() => setBlockNumber(latestBlockNumber)}
              disabled={blockNumber === latestBlockNumber}
            />
          }
        />

        <div className="mt-5">
          <Button
            block
            onClick={() => downloadParticipants(blockNumber, projectId, pv)}
          >
            <Trans>Participants</Trans>
          </Button>
        </div>

        <div className="mt-5">
          <Button
            block
            onClick={() => downloadV1Payouts(blockNumber, projectId)}
          >
            <Trans>Payouts</Trans>
          </Button>
        </div>

        <div className="mt-5">
          <Button
            block
            onClick={() => downloadPayments(blockNumber, projectId, pv)}
          >
            <Trans>Payments</Trans>
          </Button>
        </div>

        <div className="mt-5">
          <Button
            block
            onClick={() => downloadRedemptions(blockNumber, projectId, pv)}
          >
            <Trans>Redemptions</Trans>
          </Button>
        </div>

        <div className="mt-5">
          <Button
            block
            onClick={() =>
              downloadAdditionsToBalance(blockNumber, projectId, pv)
            }
          >
            <Trans>Additions to balance</Trans>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
