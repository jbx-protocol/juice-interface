import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { Split } from 'models/splits'
import { AllocatorBadge } from '../../../AllocatorBadge'
import V2V3ProjectHandleLink from '../V2V3ProjectHandleLink'

export function JuiceboxProjectBeneficiary({
  split,
  value,
}: {
  split: Split
  value?: string | JSX.Element
}) {
  if (!split.projectId) return null

  return (
    <div>
      <div className="flex gap-2">
        <V2V3ProjectHandleLink
          projectId={parseInt(split.projectId)}
          withProjectAvatar
        />
        <AllocatorBadge allocator={split.allocator} />
      </div>
      {split.allocator === NULL_ALLOCATOR_ADDRESS ? (
        <div className="ml-2 flex items-center gap-x-1 text-xs text-grey-500 dark:text-grey-300">
          {value ? (
            <>
              <Tooltip
                title={
                  <Trans>
                    This address receives the tokens minted by this payout.
                  </Trans>
                }
              >
                <span className="underline decoration-smoke-500 decoration-dotted dark:decoration-slate-200">
                  <Trans>Tokens:</Trans>
                </span>
              </Tooltip>
              {value}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
