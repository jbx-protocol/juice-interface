import { Trans } from '@lingui/macro'
import { MinimalCollapse } from 'components/shared/MinimalCollapse'
import ExternalLink from 'components/shared/ExternalLink'
import { CSSProperties } from 'react'
import { helpPagePath } from 'utils/helpPageHelper'

export function PayoutConfigurationExplainerCollapse({
  style,
}: {
  style?: CSSProperties
}) {
  return (
    <MinimalCollapse header={<Trans>How do I decide?</Trans>} style={style}>
      <p>
        <Trans>
          Use <strong>Amounts</strong> when you want to configure a{' '}
          <strong>distribution limit</strong>. Treasury funds that exceed the
          distribution limit are called <strong>overflow</strong>. Token holders
          can redeem (burn) their tokens for a portion of the overflow.{' '}
          <ExternalLink href={helpPagePath('dev/learn/glossary/overflow')}>
            Learn more
          </ExternalLink>
          .
        </Trans>
      </p>

      <p>
        <Trans>
          Use <strong>Percentages</strong> when you want to configure an{' '}
          <strong>infinite distribution limit.</strong> With an infinite
          distribution limit, your project reserves all funds for itself. Your
          project won't have overflow, so tokens can never be redeemed for ETH.{' '}
          <ExternalLink href={helpPagePath('dev/learn/glossary/overflow')}>
            Learn more
          </ExternalLink>
          .
        </Trans>
      </p>
    </MinimalCollapse>
  )
}
