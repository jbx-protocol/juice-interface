import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import { Button, Modal, ModalProps } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { useJBContractContext } from 'juice-sdk-react'
import { useEffect, useState } from 'react'
import { useBlockNumber } from 'wagmi'
import { useDownloadPayments } from './hooks/useDownloadPayments'

export default function DownloadActivityModal(props: ModalProps) {
  const [blockNumber, setBlockNumber] = useState<number>()
  const { projectId: _projectId } = useJBContractContext()
  const projectId = Number(_projectId)

  const { data: latestBlockNumber } = useBlockNumber() 

  // Use block number 5 blocks behind chain head to allow for subgraph being a bit behind on indexing.
  const adjustedLatestBlockNumber = latestBlockNumber ? Number(latestBlockNumber) - 5 : undefined

  const { downloadPayments } = useDownloadPayments(blockNumber ?? 0, projectId);

  useEffect(() => {
    setBlockNumber(adjustedLatestBlockNumber)
  }, [adjustedLatestBlockNumber])
  
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
            onClick={() => setBlockNumber(adjustedLatestBlockNumber)}
            disabled={blockNumber === adjustedLatestBlockNumber}
          />
        }
        className="mb-0"
        max={adjustedLatestBlockNumber}
      />

      <div className="flex flex-col gap-2 mt-4">
        {/* <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadParticipants(blockNumber, projectId, pv)}
        >
          <span>
            <Trans>Token holders</Trans>
          </span>
        </Button> */}

        {/* <Button
          block
          icon={<DownloadOutlined />}
          onClick={() => downloadV4Payouts(blockNumber, projectId)}
        >
          <span>
            <Trans>Payouts</Trans>
          </span>
        </Button> */}

        <Button
          block
          icon={<ArrowDownTrayIcon />}
          onClick={downloadPayments}
        >
          <span>
            <Trans>Payments</Trans>
          </span>
        </Button>

        {/* <Button
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
        </Button> */}
      </div>
    </Modal>
  )
}
