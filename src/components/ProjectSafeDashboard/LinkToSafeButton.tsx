import { RightOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { generateSafeTxUrl } from 'lib/safe'
import { SafeTransactionType } from 'models/safe'
import { classNames } from 'utils/classNames'

export function LinkToSafeButton({
  className,
  transaction,
}: {
  className?: string
  transaction: SafeTransactionType
}) {
  return (
    <div className={classNames('ml-6 flex', className)}>
      <ExternalLink
        className="text-black underline hover:text-haze-400 hover:underline dark:text-grey-100 dark:hover:text-haze-400"
        href={generateSafeTxUrl(transaction)}
      >
        <Trans>See Tx on Safe</Trans>
        <RightOutlined className="ml-1 text-xs" />
      </ExternalLink>
    </div>
  )
}
