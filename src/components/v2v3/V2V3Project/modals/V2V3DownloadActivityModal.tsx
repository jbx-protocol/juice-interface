import { t, Trans } from '@lingui/macro'
import { Button, Modal, ModalProps, Space } from 'antd'
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
} from 'utils/csvDownloadHelpers'
import { DownloadOutlined } from '@ant-design/icons'

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
      title={<Trans>Download project activity CSV</Trans>}
      {...props}
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
          onClick={() => downloadV2V3Payouts(blockNumber, projectId)}
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
