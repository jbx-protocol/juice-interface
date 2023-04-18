import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import { twMerge } from 'tailwind-merge'
import { AboutButton } from './Button'

export const JoinOurDiscordButton = ({ className }: { className?: string }) => (
  <ExternalLink href="https://discord.gg/wFTh4QnDzk">
    <AboutButton className={twMerge('flex items-center gap-2', className)}>
      <Discord className="h-5 w-5" />
      <Trans>Join our Discord</Trans>
    </AboutButton>
  </ExternalLink>
)
