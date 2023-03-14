import { CloseOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { useState } from 'react'

export function BrandUpdateBanner() {
  const [visible, setVisible] = useState<boolean>(true)

  const twitterMessage = `@juiceboxETH https://juicebox.money`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    twitterMessage,
  )}`

  if (!visible) return null

  return (
    <div>
      <div className="flex h-11 items-center justify-center bg-split-400">
        <span className="text-grey-900">
          <Trans>Juicebox has a fresh new look</Trans> &#128064;{' '}
          <ExternalLink
            href={twitterUrl}
            className="font-normal text-black underline"
          >
            Let us know what you think
          </ExternalLink>
          .
        </span>
        <CloseOutlined
          onClick={() => setVisible(false)}
          className="absolute right-5 text-black"
        />
      </div>
    </div>
  )
}
