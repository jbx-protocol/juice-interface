import { LockFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { Split } from 'models/splits'
import { formatDate } from 'utils/format/formatDate'

export function PayoutTitle({ payoutSplit }: { payoutSplit: Split }) {
  const isProject =
    Boolean(payoutSplit.projectId) && payoutSplit.projectId !== '0x00'

  return (
    <div className="flex items-center gap-2">
      {isProject ? (
        <V2V3ProjectHandleLink
          projectId={parseInt(payoutSplit.projectId as string)}
        />
      ) : (
        <EthereumAddress address={payoutSplit.beneficiary} />
      )}
      {!!payoutSplit.lockedUntil && (
        <Tooltip
          title={t`Locked until ${formatDate(
            payoutSplit.lockedUntil * 1000,
            'yyyy-MM-DD',
          )}`}
        >
          <LockFilled />
        </Tooltip>
      )}
    </div>
  )
}
