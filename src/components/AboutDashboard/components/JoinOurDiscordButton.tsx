import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import { twMerge } from 'tailwind-merge'

export const JoinOurDiscordButton = ({ className }: { className?: string }) => (
  <ExternalLink href="https://discord.gg/wFTh4QnDzk">
    <Button
      className={twMerge(
        'flex items-center gap-2 leading-none text-white',
        className,
      )}
      type="primary"
      size="large"
      icon={<Discord className="h-5 w-5" />}
    >
      <Trans>Join our Discord</Trans>
    </Button>
  </ExternalLink>
)
