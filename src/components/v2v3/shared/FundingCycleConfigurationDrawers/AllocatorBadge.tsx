import * as constants from '@ethersproject/constants'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { V2_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'

export function AllocatorBadge({
  allocator,
}: {
  allocator: string | undefined
}) {
  const versionName =
    allocator === constants.AddressZero
      ? 'V3'
      : allocator === V2_ALLOCATOR_ADDRESS
      ? 'V2'
      : null // TODO: add v1 allocator

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
