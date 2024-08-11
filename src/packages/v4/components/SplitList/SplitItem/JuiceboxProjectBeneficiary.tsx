import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { AllocatorBadge } from 'components/AllocatorBadge'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { JBSplit } from 'juice-sdk-core'
import V4ProjectHandleLink from '../../V4ProjectHandleLink'
export function JuiceboxProjectBeneficiary({
  split,
  value,
}: {
  split: JBSplit
  value?: string | JSX.Element
}) {
  if (!split.projectId) return null

  return (
    <div>
      <div className="flex gap-2">
        <V4ProjectHandleLink
          projectId={Number(split.projectId)}
          withProjectAvatar
        />
        <AllocatorBadge allocator={split.hook} />
      </div>
      {split.hook === NULL_ALLOCATOR_ADDRESS ? (
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
