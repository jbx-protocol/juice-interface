import { Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { Split } from 'models/splits'
import { AllocatorBadge } from '../FundingCycleConfigurationDrawers/AllocatorBadge'
import V2V3ProjectHandleLink from '../V2V3ProjectHandleLink'
import { CrownFilled } from '@ant-design/icons'
import FormattedAddress from 'components/FormattedAddress'

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

  const isProjectOwner = projectOwnerAddress === split.beneficiary

  return (
    <div>
      <Space size="small">
        <V2V3ProjectHandleLink projectId={parseInt(split.projectId)} />
        <AllocatorBadge allocator={split.allocator} />
      </Space>
      {split.allocator === NULL_ALLOCATOR_ADDRESS ? (
        <div className="ml-2 whitespace-nowrap text-xs text-grey-500 dark:text-grey-300">
          <TooltipLabel
            label={<Trans>Tokens:</Trans>}
            tip={
              <Trans>
                This address will receive any tokens minted when the recipient
                project gets paid.
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
