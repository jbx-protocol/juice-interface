import { t, Trans } from '@lingui/macro'
import { Button, Modal, Space } from 'antd'
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
import { DownloadOutlined } from '@ant-design/icons'

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
      okButtonProps={{ hidden: true }}
      title={<Trans>Download project activity CSV</Trans>}
      centered
    >
      <label className="mb-1 block">
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
        className="mb-4"
      />

      <Space direction="vertical" className="w-full">
        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadParticipants(blockNumber, projectId, pv)}
        >
          <span>
            <Trans>Participants</Trans>
          </span>
        </Button>

        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadV1Payouts(blockNumber, projectId)}
        >
          <span>
            <Trans>Payouts</Trans>
          </span>
        </Button>

        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadPayments(blockNumber, projectId, pv)}
        >
          <span>
            <Trans>Payments</Trans>
          </span>
        </Button>

        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadRedemptions(blockNumber, projectId, pv)}
        >
          <span>
            <Trans>Redemptions</Trans>
          </span>
        </Button>

        <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadAdditionsToBalance(blockNumber, projectId, pv)}
        >
          <span>
            <Trans>Additions to balance</Trans>
          </span>
        </Button>
      </Space>
    </Modal>
  )
}
