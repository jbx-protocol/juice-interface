import React from 'react'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'

import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { MessageOutlined } from '@ant-design/icons'

import { useContext } from 'react'

export default function FeedbackFormLink({
  mobile,
  projectHandle,
}: {
  mobile?: boolean
  projectHandle?: string
}) {
  const { userAddress } = useContext(NetworkContext)
  const { isDarkMode } = useContext(ThemeContext)

  const formUrl = () => {
    let url = `https://auditor.typeform.com/to/REMUTIbQ#`
    if (projectHandle) {
      url += `project=${projectHandle}&`
    }
    if (userAddress) {
      url += `address=${userAddress}&`
    }
    url += `resolution=${window.innerWidth}x${window.innerHeight}`
    return url
  }

  const iconSize = 16

  if (mobile) {
    return (
      <div style={{ height: 30 }}>
        <MessageOutlined size={iconSize} />
        <a
          style={{ margin: '0 0 2px 12px', fontWeight: 400 }}
          className="quiet"
          href={formUrl()}
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
          href={formUrl()}
          target="_blank"
          rel="noreferrer"
        >
          <Trans>Give feedback</Trans>
        </a>
      }
    >
      <a
        className="feedback-button hide-mobile"
        href={formUrl()}
        target="_blank"
        rel="noreferrer"
        style={
          isDarkMode
            ? { boxShadow: 'none', backgroundColor: 'var(--background-l2)' }
            : undefined
        }
      >
        <img src="/assets/stoned_banny.png" alt="Stoned banny" />
      </a>
    </Tooltip>
  )
}
