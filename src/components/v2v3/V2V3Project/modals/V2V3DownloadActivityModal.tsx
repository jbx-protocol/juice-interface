import { t, Trans } from '@lingui/macro'
import { Button, Modal, ModalProps } from 'antd'
import { readProvider } from 'constants/readProvider'
import { useEffect, useState, useContext } from 'react'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import {
  downloadParticipants,
  downloadV2V3Payouts,
  downloadPayments,
  downloadRedemptions,
  downloadAdditionsToBalance,
} from 'utils/buildActivityCsvs'

export default function V2V3DownloadActivityModal(props: ModalProps) {
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>()
  const [blockNumber, setBlockNumber] = useState<number>()

  useEffect(() => {
    readProvider.getBlockNumber().then(val => {
      setLatestBlockNumber(val)
      setBlockNumber(val)
    })
  }, [])

  const { projectId, pv } = useContext(ProjectMetadataContext)

  return (
    <Modal
      cancelText={t`Close`}
      okButtonProps={{ hidden: true }}
      centered
      {...props}
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
            onClick={() => downloadV2V3Payouts(blockNumber, projectId)}
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
