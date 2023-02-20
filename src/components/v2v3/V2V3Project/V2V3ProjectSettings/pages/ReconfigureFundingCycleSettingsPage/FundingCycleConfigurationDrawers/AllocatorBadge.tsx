import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import {
  V1_V3_ALLOCATOR_ADDRESS,
  V2_V3_ALLOCATOR_ADDRESS,
} from 'constants/contracts/mainnet/Allocators'

const allocatorAddresses = [V2_V3_ALLOCATOR_ADDRESS, V1_V3_ALLOCATOR_ADDRESS]

export function AllocatorBadge({
  allocator,
}: {
  allocator: string | undefined
}) {
  const versionName =
    allocator && allocatorAddresses.includes(allocator) ? 'V3' : undefined

  if (!versionName) return null
  return (
    <Tooltip
      title={
        <Trans>
          Payout allocated to this project's {versionName} payment terminal.{' '}
          <ExternalLink
            href={'https://github.com/jbx-protocol/juice-v3-migration'}
          >
            Learn more
          </ExternalLink>
          .
        </Trans>
      }
    >
      <div>
        <ProjectVersionBadge
          className="bg-smoke-200 text-xs text-smoke-700 dark:bg-slate-300 dark:text-slate-100"
          versionText={versionName}
        />
      </div>
    </Tooltip>
  )
}
