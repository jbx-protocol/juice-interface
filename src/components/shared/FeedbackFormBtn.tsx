import React from 'react'
import { ThemeContext } from 'contexts/themeContext'

import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { MessageOutlined } from '@ant-design/icons'

import { useContext } from 'react'

import { feedbackFormURL } from 'utils/feedbackFormURL'
import { NetworkContext } from 'contexts/networkContext'

export default function FeedbackFormBtn({
  mobile,
  projectHandle,
}: {
  mobile?: boolean
  projectHandle?: string
}) {
  const { isDarkMode } = useContext(ThemeContext)
  const { userAddress } = useContext(NetworkContext)

  const formUrl = feedbackFormURL('stoned-banny', projectHandle, userAddress)

  const iconSize = 16

  if (mobile) {
    return (
      <div style={{ height: 30 }}>
        <MessageOutlined size={iconSize} />
        <a
          style={{ margin: '0 0 2px 12px', fontWeight: 400 }}
          className="quiet"
          href={formUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Trans>Give feedback</Trans>
        </a>
      </div>
    )
  }

  return (
    <Tooltip
      title={
        <a
          className="quiet hover-action"
          href={formUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Trans>Give feedback</Trans>
        </a>
      }
    >
      <a
        className={`feedback-button hide-mobile ${isDarkMode ? 'dark' : ''}`}
        href={formUrl}
        target="_blank"
        rel="noreferrer"
      >
        <img src="/assets/stoned_banny.png" alt="Stoned banny" />
      </a>
    </Tooltip>
  )
}
