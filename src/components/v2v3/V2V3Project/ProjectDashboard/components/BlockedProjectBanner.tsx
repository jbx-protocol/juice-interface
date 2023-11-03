import { Trans } from '@lingui/macro'
import Banner from 'components/Banner'
import ExternalLink from 'components/ExternalLink'
import { useV2BlockedProject } from 'hooks/useBlockedProject'

export function BlockedProjectBanner({ className }: { className?: string }) {
  const isBlockedProject = useV2BlockedProject()
  if (!isBlockedProject) return null

  const delistingPolicyLink =
    'https://github.com/peeldao/proposals/pull/42/files'
  const discordLink = 'https://discord.gg/wFTh4QnDzk'

  return (
    <div className={className}>
      <Banner
        title={<Trans>Delisted project</Trans>}
        body={
          <Trans>
            This project has been <strong>delisted</strong> for breaching our{' '}
            <ExternalLink href={delistingPolicyLink}>policy</ExternalLink>.{' '}
            <ExternalLink href={discordLink}>Get in touch</ExternalLink>.
          </Trans>
        }
        variant="warning"
      />
    </div>
  )
}
