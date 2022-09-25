import { ThemeContext } from 'contexts/themeContext'
import { useWallet } from 'hooks/Wallet'

import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'

import { useContext } from 'react'

import Image from 'next/image'
import { feedbackFormURL } from 'utils/feedbackFormURL'

import ExternalLink from './ExternalLink'
import stonedBanny from '/public/assets/stoned_banny.png'

export function FeedbackFormButton({
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

  return (
    <Tooltip
      title={
        <ExternalLink
          className="hover-text-action-primary hover-text-decoration-underline"
          href={formUrl}
        >
          <Trans>Give feedback</Trans>
        </ExternalLink>
      }
    >
      <ExternalLink
        className={`feedback-button hide-mobile ${isDarkMode ? 'dark' : ''}`}
        href={formUrl}
      >
        <Image src={stonedBanny} alt="Stoned banny" />
      </ExternalLink>
    </Tooltip>
  )
}
