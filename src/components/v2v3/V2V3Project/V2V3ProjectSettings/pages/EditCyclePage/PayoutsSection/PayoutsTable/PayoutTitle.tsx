import { LockFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { Split } from 'models/splits'
import { formatDate } from 'utils/format/formatDate'
import { usePayoutsTableContext } from './context/PayoutsTableContext'

export function PayoutTitle({ payoutSplit }: { payoutSplit: Split }) {
  const { showAvatars } = usePayoutsTableContext()

  const isProject =
    Boolean(payoutSplit.projectId) && payoutSplit.projectId !== '0x00'

  return (
    <div className="flex items-center gap-2">
      {isProject ? (
        <V2V3ProjectHandleLink
          projectId={parseInt(payoutSplit.projectId as string)}
          withProjectAvatar={showAvatars}
        />
      ) : (
        <EthereumAddress
          address={payoutSplit.beneficiary}
          withEnsAvatar={showAvatars}
        />
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
