import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import {
  V1_V3_ALLOCATOR_ADDRESS,
  V2_V3_ALLOCATOR_ADDRESS,
} from 'constants/contracts/mainnet/Allocators'

export function AllocatorBadge({
  allocator,
}: {
  allocator: string | undefined
}) {
  const allocatorAddresses = [V2_V3_ALLOCATOR_ADDRESS, V1_V3_ALLOCATOR_ADDRESS]
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
        <ProjectVersionBadge versionText={versionName} />
      </div>
    </Tooltip>
  )
}
