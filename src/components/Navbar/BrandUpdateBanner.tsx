import { CloseOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function BrandUpdateBanner({ className }: { className?: string }) {
  const [visible, setVisible] = useState<boolean>(true)

  const twitterMessage = `@juiceboxETH https://juicebox.money`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    twitterMessage,
  )}`

  if (!visible) return null

  return (
    <div>
      <div
        className={twMerge(
          'flex w-full items-center justify-center gap-x-4 bg-split-400 px-2 py-4 md:h-9',
          className,
        )}
      >
        <span className="flex-1 text-xs text-grey-900 md:text-center">
          <span className="mr-2">
            <Trans>Juicebox has a fresh new look</Trans> &#128064;
          </span>
          <ExternalLink
            href={twitterUrl}
            className="font-normal text-black underline hover:text-grey-700"
          >
            <Trans>Let us know what you think</Trans>
          </ExternalLink>
        </span>
        <CloseOutlined
          className="justify-self-end text-black md:absolute md:right-5"
          onClick={() => setVisible(false)}
        />
      </div>
    </div>
  )
}
