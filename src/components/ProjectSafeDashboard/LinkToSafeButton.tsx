import { RightOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { generateSafeTxUrl } from 'lib/safe'
import { SafeTransactionType } from 'models/safe'
import { CSSProperties } from 'react'

export function LinkToSafeButton({
  transaction,
  style,
}: {
  transaction: SafeTransactionType
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        marginLeft: '1.5rem',
        fontSize: '0.8rem',
      }}
    >
      <ExternalLink
        href={generateSafeTxUrl(transaction)}
        style={{ textDecoration: 'underline' }}
        className="text-primary hover-text-action-primary"
      >
        <Trans>See Tx on Safe</Trans>
        <RightOutlined style={{ fontSize: '0.75rem', marginLeft: 5 }} />
      </ExternalLink>
    </div>
  )
}
