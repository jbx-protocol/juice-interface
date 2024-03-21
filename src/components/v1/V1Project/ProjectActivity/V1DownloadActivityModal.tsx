import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Modal, Space } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useBlockNumber } from 'hooks/useBlockNumber'
import { useContext, useEffect, useState } from 'react'
import {
  downloadAdditionsToBalance,
  downloadParticipants,
  downloadPayments,
  downloadRedemptions,
  downloadV1Payouts,
} from 'utils/csvDownloadHelpers'

export function V1DownloadActivityModal({
  open,
  onCancel,
}: {
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const [blockNumber, setBlockNumber] = useState<number>()

  // Use block number 5 blocks behind chain head to allow for subgraph being a bit behind on indexing.
  const { data: latestBlockNumber } = useBlockNumber({ behindChainHeight: 5 })

  useEffect(() => {
    setBlockNumber(latestBlockNumber)
  }, [latestBlockNumber])

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
            <Trans>Token holders</Trans>
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
            <Trans>ETH transfers to project</Trans>
          </span>
        </Button>
      </Space>
    </Modal>
  )
}
