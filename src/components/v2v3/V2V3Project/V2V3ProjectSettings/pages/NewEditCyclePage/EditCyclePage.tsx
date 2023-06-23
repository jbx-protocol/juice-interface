import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { helpPagePath } from 'utils/routes'

export function EditCyclePage() {
  return (
    <div>
      <p>
        <Trans>
          Configure your cycle for transparent treasury and campaign management.
          Any adjustments made will be published on Ethereum to inform
          contributors.
        </Trans>{' '}
        <ExternalLink href={helpPagePath('')}>Learn more</ExternalLink>
      </p>

      {/* Details */}
      <div className="divide-y divide-solid divide-slate-400">
        <div className="grid gap-4 py-5 md:grid-cols-[300px_1fr]">
          <div className="text-sm font-medium">
            <div className="mb-2 font-medium">
              <Trans>Details</Trans>
            </div>
            <div className="text-secondary">
              <Trans>
                Set up your top-level project configuration details.
              </Trans>
            </div>
          </div>
          <div>TODO</div>
        </div>

        {/* Payouts */}
        <div className="grid gap-4 py-5 md:grid-cols-[300px_1fr]">
          <div className="text-sm font-medium">
            <div className="mb-2 font-medium">
              <Trans>Payouts</Trans>
            </div>
            <div className="text-secondary">
              <Trans>How your project will be paid and pay out in ETH.</Trans>
            </div>
          </div>
          <div>TODO</div>
        </div>

        {/* Tokens */}
        <div className="grid gap-4 py-5 md:grid-cols-[300px_1fr]">
          <div className="text-sm font-medium">
            <div className="mb-2 font-medium">
              <Trans>Tokens</Trans>
            </div>
            <div className="text-secondary">
              <Trans>Manage how your projects tokens should work.</Trans>
            </div>
          </div>
          <div>TODO</div>
        </div>

        {/* NFTs */}
        <div className="grid gap-4 py-5 md:grid-cols-[300px_1fr]">
          <div className="text-sm font-medium">
            <div className="mb-2 font-medium">
              <Trans>NFTs</Trans>
            </div>
            <div className="text-secondary">
              <Trans>
                Manage how you reward supporters when they support your project.
              </Trans>
            </div>
          </div>
          <div>TODO</div>
        </div>
      </div>
    </div>
  )
}
