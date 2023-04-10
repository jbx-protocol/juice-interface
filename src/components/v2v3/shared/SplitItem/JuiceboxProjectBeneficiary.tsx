import { CrownFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { Split } from 'models/splits'
import { isEqualAddress } from 'utils/address'
import { AllocatorBadge } from '../FundingCycleConfigurationDrawers/AllocatorBadge'
import V2V3ProjectHandleLink from '../V2V3ProjectHandleLink'

export function JuiceboxProjectBeneficiary({
  projectOwnerAddress,
  split,
  value,
}: {
  split: Split
  projectOwnerAddress: string | undefined
  value?: string | JSX.Element
}) {
  if (!split.projectId) return null

  const isProjectOwner = isEqualAddress(projectOwnerAddress, split.beneficiary)

  return (
    <div>
      <div className="flex gap-2">
        <V2V3ProjectHandleLink projectId={parseInt(split.projectId)} />
        <AllocatorBadge allocator={split.allocator} />
      </div>
      {split.allocator === NULL_ALLOCATOR_ADDRESS ? (
        <div className="ml-2 text-xs text-grey-500 dark:text-grey-300">
          <TooltipLabel
            label={<Trans>Tokens:</Trans>}
            tip={
              <Trans>
                This address receives the tokens minted by this payout.
              </Trans>
            }
          />{' '}
          {value ?? <FormattedAddress address={split.beneficiary} />}{' '}
          {isProjectOwner && (
            <Tooltip title={<Trans>Project owner</Trans>}>
              <CrownFilled />
            </Tooltip>
          )}
        </div>
      ) : null}
    </div>
  )
}
