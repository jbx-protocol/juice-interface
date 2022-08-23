import { ThemeContext } from 'contexts/themeContext'
import { useWallet } from 'hooks/Wallet'

import { MessageOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'

import { useContext } from 'react'

import { feedbackFormURL } from 'utils/feedbackFormURL'

import ExternalLink from './ExternalLink'

export default function FeedbackFormButton({
  mobile,
  projectHandle,
}: {
  mobile?: boolean
  projectHandle?: string
}) {
  const { isDarkMode } = useContext(ThemeContext)
  const { userAddress } = useWallet()

  const formUrl = feedbackFormURL({
    referrer: 'stoned-banny',
    projectHandle,
    userAddress,
  })

  const iconSize = 16

  if (mobile) {
    return (
      <div>
        <MessageOutlined size={iconSize} />
        <ExternalLink
          style={{ margin: '0 0 2px 12px', fontWeight: 400 }}
          className="quiet"
          href={formUrl}
        >
          <Trans>Give feedback</Trans>
        </ExternalLink>
      </div>
    )
  }

  return (
    <Tooltip
      title={
        <ExternalLink className="quiet hover-action" href={formUrl}>
          <Trans>Give feedback</Trans>
        </ExternalLink>
      }
    >
      <ExternalLink
        className={`feedback-button hide-mobile ${isDarkMode ? 'dark' : ''}`}
        href={formUrl}
      >
        <img src="/assets/stoned_banny.png" alt="Stoned banny" />
      </ExternalLink>
    </Tooltip>
  )
}
