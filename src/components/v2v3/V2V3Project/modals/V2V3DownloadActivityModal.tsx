import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Modal, ModalProps } from 'antd'
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
  downloadV2V3Payouts,
} from 'utils/csvDownloadHelpers'

export default function V2V3DownloadActivityModal(props: ModalProps) {
  const [blockNumber, setBlockNumber] = useState<number>()

  // Use block number 5 blocks behind chain head to allow for subgraph being a bit behind on indexing.
  const { data: latestBlockNumber } = useBlockNumber({ behindChainHeight: 5 })

  useEffect(() => {
    setBlockNumber(latestBlockNumber)
  }, [latestBlockNumber])

  const { projectId, pv } = useContext(ProjectMetadataContext)

  return (
    <Modal
      cancelText={t`Close`}
      okButtonProps={{ hidden: true }}
      centered
      title={<Trans>Download project activity CSVs</Trans>}
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

      <div className="flex flex-col gap-2">
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
            <Trans>ETH transfers</Trans>
          </span>
        </Button>
      </div>
    </Modal>
  )
}
